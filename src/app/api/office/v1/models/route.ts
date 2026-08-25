import { NextResponse } from "next/server";
import { listLiteLlmModelIds } from "@/server/office/litellm-model";

const FALLBACK = [
  "anthropic/claude-sonnet-4.5",
  "anthropic/claude-haiku-4.5",
  "openai/gpt-4o-mini",
  "google/gemini-2.5-flash",
];

export async function GET() {
  const ids = await listLiteLlmModelIds();
  const listed = ids.length > 0 ? ids : FALLBACK;
  return NextResponse.json({
    object: "list",
    data: listed.map((id) => ({ id, object: "model" })),
  });
}
