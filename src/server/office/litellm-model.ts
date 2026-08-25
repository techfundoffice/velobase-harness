import { env } from "@/env";

let cachedIds: string[] | null = null;
let cachedAt = 0;

export async function listLiteLlmModelIds(): Promise<string[]> {
  const now = Date.now();
  if (cachedIds && now - cachedAt < 60_000) return cachedIds;
  const base = env.LITELLM_URL?.replace(/\/$/, "");
  const master = env.LITELLM_MASTER_KEY;
  if (!base || !master) return cachedIds ?? [];
  const res = await fetch(`${base}/v1/models`, {
    headers: { authorization: `Bearer ${master}` },
  });
  if (!res.ok) return cachedIds ?? [];
  const json = (await res.json()) as { data?: Array<{ id?: unknown }> };
  const ids = (json.data ?? [])
    .map((m) => (typeof m.id === "string" ? m.id : ""))
    .filter(Boolean);
  cachedIds = ids;
  cachedAt = now;
  return ids;
}

function score(id: string, requested: string): number {
  const a = id.toLowerCase();
  const r = requested.toLowerCase();
  if (a === r) return 1000;
  if (a.endsWith("/" + r) || a.endsWith(r)) return 900;
  if (r.startsWith("claude") && a.includes("claude") && a.includes("sonnet")) return 80;
  if (r.startsWith("claude") && a.includes("claude")) return 60;
  if ((r.startsWith("gpt") || r.startsWith("o1") || r.startsWith("o3")) && a.includes("gpt-4o-mini")) return 80;
  if ((r.startsWith("gpt") || r.startsWith("o1") || r.startsWith("o3")) && a.includes("gpt")) return 50;
  if (r.startsWith("gemini") && a.includes("gemini")) return 70;
  if (a.includes("gpt-4o-mini")) return 20;
  return 0;
}

export async function resolveLiteLlmModel(requested: string): Promise<string> {
  const raw = requested.trim() || "gpt-4o-mini";
  const ids = await listLiteLlmModelIds();
  if (ids.length === 0) {
    if (raw.startsWith("openrouter/")) return raw;
    return `openrouter/${raw}`;
  }
  let best = ids[0]!;
  let bestScore = -1;
  for (const id of ids) {
    const s = score(id, raw);
    if (s > bestScore) {
      best = id;
      bestScore = s;
    }
  }
  return best;
}
