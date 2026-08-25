import { NextResponse } from "next/server";
import { listLiteLlmModelIds } from "@/server/office/litellm-model";

export async function GET() {
  const ids = await listLiteLlmModelIds();
  return NextResponse.json({
    object: "list",
    data: ids.map((id) => ({ id, object: "model" })),
  });
}
