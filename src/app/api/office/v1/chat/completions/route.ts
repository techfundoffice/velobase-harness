import { NextResponse } from "next/server";
import { env } from "@/env";
import { getBalance } from "@/server/billing/services/get-balance";
import { postConsume } from "@/server/billing/services/post-consume";
import { calculateChatCost } from "@/server/billing/config/token-pricing";
import { resolveOfficeDesktopKey } from "@/server/office/keys";
import { resolveLiteLlmModel } from "@/server/office/litellm-model";
import { createId } from "@paralleldrive/cuid2";

const BILLING =
  process.env.APP_URL?.replace(/\/$/, "") ||
  "https://velobase-harness-ai-office-by-cloud-computer-ai.up.railway.app";

function creditsExhausted() {
  return NextResponse.json(
    {
      error: {
        message: `Your CloudComputerAI credits have been exhausted. Please visit ${BILLING}/pricing to purchase more credits.`,
        type: "insufficient_quota",
        code: "insufficient_quota",
      },
    },
    { status: 402 },
  );
}

async function userFromRequest(req: Request): Promise<string | null> {
  const header = req.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  return resolveOfficeDesktopKey(token);
}

export async function POST(req: Request) {
  const userId = await userFromRequest(req);
  if (!userId) {
    return creditsExhausted();
  }

  const litellmUrl = env.LITELLM_URL?.replace(/\/$/, "");
  const master = env.LITELLM_MASTER_KEY;
  if (!litellmUrl || !master) {
    return NextResponse.json(
      { error: { message: "LiteLLM is not configured" } },
      { status: 503 },
    );
  }

  try {
    const balance = await getBalance({ userId });
    if (balance.totalSummary.available <= 0) {
      return creditsExhausted();
    }
  } catch {
    // fail-open if billing lookup breaks; still require a valid desktop key
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const modelName = typeof body.model === "string" && body.model.trim() ? body.model : "gpt-4o-mini";
  const model = await resolveLiteLlmModel(modelName);
  const stream = Boolean(body.stream);
  const upstreamBody = {
    ...body,
    model,
    ...(stream ? { stream_options: { include_usage: true } } : {}),
  };

  const upstream = await fetch(`${litellmUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${master}`,
    },
    body: JSON.stringify(upstreamBody),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    const exhausted =
      /budget|quota|credit|insufficient/i.test(text) ||
      upstream.status === 401 ||
      upstream.status === 402;
    if (exhausted) return creditsExhausted();
    return new NextResponse(text || `LiteLLM HTTP ${upstream.status}`, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") || "application/json" },
    });
  }

  if (!stream) {
    const json = (await upstream.json()) as {
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    void settleCredits(userId, model, json.usage);
    return NextResponse.json(json);
  }

  if (!upstream.body) {
    return NextResponse.json({ error: { message: "Empty stream" } }, { status: 502 });
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let leftover = "";
  let promptTokens = 0;
  let completionTokens = 0;

  const out = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        void settleCredits(userId, model, {
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
        });
        controller.close();
        return;
      }
      controller.enqueue(value);
      leftover += decoder.decode(value, { stream: true });
      const lines = leftover.split("\n");
      leftover = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const event = JSON.parse(payload) as {
            usage?: { prompt_tokens?: number; completion_tokens?: number };
          };
          if (event.usage) {
            promptTokens = event.usage.prompt_tokens ?? promptTokens;
            completionTokens = event.usage.completion_tokens ?? completionTokens;
          }
        } catch {
          /* ignore partial JSON */
        }
      }
    },
  });

  return new NextResponse(out, {
    status: 200,
    headers: {
      "content-type": upstream.headers.get("content-type") || "text/event-stream",
      "cache-control": "no-cache",
    },
  });
}

async function settleCredits(
  userId: string,
  model: string,
  usage?: { prompt_tokens?: number; completion_tokens?: number },
) {
  const amount = calculateChatCost(
    model,
    usage?.prompt_tokens ?? 0,
    usage?.completion_tokens ?? 0,
  );
  if (amount <= 0) return;
  try {
    await postConsume({
      userId,
      amount,
      businessId: `office_${createId()}`,
      businessType: "TOKEN_USAGE",
      description: "AI Office desktop chat",
    });
  } catch {
    /* already delivered the completion */
  }
}
