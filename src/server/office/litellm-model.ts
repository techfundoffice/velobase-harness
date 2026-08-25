export function toLiteLlmModel(model: string): string {
  const id = String(model || "").trim();
  if (!id) return "openrouter/openai/gpt-4o-mini";
  if (id.startsWith("openrouter/")) return id;
  if (id.startsWith("claude")) return `openrouter/anthropic/${id}`;
  if (id.startsWith("gpt") || id.startsWith("o1") || id.startsWith("o3")) {
    return `openrouter/openai/${id}`;
  }
  if (id.startsWith("gemini")) return `openrouter/google/${id}`;
  return `openrouter/${id}`;
}
