import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { issueOfficeDesktopKey, officeDesktopKeyPrefix } from "@/server/office/keys";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const prefix = await officeDesktopKeyPrefix(session.user.id);
    return NextResponse.json({ hasKey: Boolean(prefix), prefix });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const key = await issueOfficeDesktopKey(session.user.id);
    return NextResponse.json({ key, prefix: key.slice(0, 16) });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
