import { NextResponse } from "next/server";

const DATA = {
  object: "list",
  data: [
    { id: "claude-opus-4-7", object: "model" },
    { id: "claude-sonnet-4-6", object: "model" },
    { id: "claude-haiku-4-5", object: "model" },
    { id: "gpt-5.2", object: "model" },
    { id: "gpt-4o-mini", object: "model" },
    { id: "gemini-3-flash-preview", object: "model" },
  ],
};

export function GET() {
  return NextResponse.json(DATA);
}
