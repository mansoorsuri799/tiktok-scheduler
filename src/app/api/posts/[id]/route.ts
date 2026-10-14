import { NextRequest, NextResponse } from "next/server";
import { deletePost } from "@/lib/store/db";
import { getSessionOpenId } from "@/lib/store/session";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const openId = await getSessionOpenId();
  if (!openId) {
    return NextResponse.json({ error: "Connect TikTok first" }, { status: 401 });
  }

  const { id } = await context.params;
  const ok = await deletePost(openId, id);
  if (!ok) {
    return NextResponse.json(
      { error: "Post not found or already publishing" },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
