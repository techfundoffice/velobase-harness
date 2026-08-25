import { env } from "@/env";

/** Desktop/Genspark ids → OpenRouter ids used by support chat and seed agents. */
const ALIASES: Record<string, string> = {
  "claude-opus-4-7": "anthropic/claude-sonnet-4.5",
  "claude-opus-4-8": "anthropic/claude-sonnet-4.5",
  "claude-opus-4-6": "anthropic/claude-sonnet-4.5",
  "claude-opus-4-5-20251101": "anthropic/claude-sonnet-4.5",
  "claude-sonnet-4-6": "anthropic/claude-sonnet-4.5",
  "claude-sonnet-4-5": "anthropic/claude-sonnet-4.5",
  "claude-sonnet-5": "anthropic/claude-sonnet-4.5",
  "claude-haiku-4-5": "anthropic/claude-haiku-4.5",
  "claude-haiku-4-5-20251001": "anthropic/claude-haiku-4.5",
  "gpt-5.2": "openai/gpt-4o-mini",
  "gpt-4o-mini": "openai/gpt-4o-mini",
  "gemini-3.1-pro-preview": "google/gemini-2.5-flash",
  "gemini-3-flash-preview": "google/gemini-2.5-flash",
};

const DEFAULT_OPENROUTER_MODEL = "anthropic/claude-sonnet-4.5";

let cachedIds: string[] | null = null;
let cachedAt = 0;

function collectIds(payload: unknown): string[] {
  const ids: string[] = [];
  const walk = (value: unknown) => {
    if (!value) return;
    if (Array.isArray(value)) {
      for (const item of value) walk(item);
      return;
    }
    if (typeof value === "object") {
      const rec = value as Record<string, unknown>;
      if (typeof rec.id === "string") ids.push(rec.id);
      if (typeof rec.model_name === "string") ids.push(rec.model_name);
      if (Array.isArray(rec.data)) walk(rec.data);
      if (Array.isArray(rec.models)) walk(rec.models);
    }
  };
  walk(payload);
  return [...new Set(ids.filter(Boolean))];
}

export async function listLiteLlmModelIds(): Promise<string[]> {
  const now = Date.now();
  if (cachedIds && now - cachedAt < 60_000) return cachedIds;
  const base = env.LITELLM_URL?.replace(/\/$/, "");
  const master = env.LITELLM_MASTER_KEY;
  if (!base || !master) return cachedIds ?? [];
  const headers = { authorization: `Bearer ${master}` };
  const ids: string[] = [];
  for (const path of ["/v1/models", "/model/info", "/v1/model/info"]) {
    try {
      const res = await fetch(`${base}${path}`, { headers });
      if (!res.ok) continue;
      ids.push(...collectIds(await res.json()));
    } catch {
      /* try next catalog path */
    }
  }
  cachedIds = [...new Set(ids)];
  cachedAt = now;
  return cachedIds;
}

export function toOpenRouterModel(requested: string): string {
  let raw = requested.trim() || DEFAULT_OPENROUTER_MODEL;
  if (raw.startsWith("openrouter/")) raw = raw.slice("openrouter/".length);
  const lower = raw.toLowerCase();
  if (ALIASES[lower]) return ALIASES[lower];
  if (raw.includes("/")) return raw;
  if (lower.startsWith("claude")) return `anthropic/${raw}`;
  if (lower.startsWith("gpt") || lower.startsWith("o1") || lower.startsWith("o3")) {
    return `openai/${raw}`;
  }
  if (lower.startsWith("gemini")) return `google/${raw}`;
  return DEFAULT_OPENROUTER_MODEL;
}

export function toLiteLlmModel(requested: string): string {
  const openrouterId = toOpenRouterModel(requested);
  return openrouterId.startsWith("openrouter/")
    ? openrouterId
    : `openrouter/${openrouterId}`;
}

function score(id: string, requested: string): number {
  const a = id.toLowerCase();
  const r = requested.toLowerCase();
  const or = toOpenRouterModel(requested).toLowerCase();
  if (a === r || a === or) return 1000;
  if (a === `openrouter/${or}`) return 950;
  if (a.endsWith("/" + r) || a.endsWith(r) || a.endsWith("/" + or) || a.endsWith(or)) {
    return 900;
  }
  if (r.startsWith("claude") && a.includes("claude") && a.includes("sonnet")) return 80;
  if (r.startsWith("claude") && a.includes("claude")) return 60;
  if ((r.startsWith("gpt") || r.startsWith("o1") || r.startsWith("o3")) && a.includes("gpt-4o-mini")) {
    return 80;
  }
  if ((r.startsWith("gpt") || r.startsWith("o1") || r.startsWith("o3")) && a.includes("gpt")) return 50;
  if (r.startsWith("gemini") && a.includes("gemini")) return 70;
  if (a.includes("gpt-4o-mini") || a.includes("claude-sonnet-4.5")) return 20;
  return 0;
}

export async function resolveLiteLlmModel(requested: string): Promise<string> {
  const fallback = toLiteLlmModel(requested);
  const ids = await listLiteLlmModelIds();
  if (ids.length === 0) return fallback;
  let best = fallback;
  let bestScore = 0;
  for (const id of ids) {
    const s = score(id, requested);
    if (s > bestScore) {
      best = id;
      bestScore = s;
    }
  }
  return bestScore > 0 ? best : fallback;
}
