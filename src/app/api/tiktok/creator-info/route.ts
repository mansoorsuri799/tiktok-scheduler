import { NextResponse } from "next/server";
import { getSessionOpenId } from "@/lib/store/session";
import { getValidAccessToken, queryCreatorInfo } from "@/lib/tiktok/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const openId = await getSessionOpenId();
  if (!openId) {
    return NextResponse.json({ error: "Connect TikTok first" }, { status: 401 });
  }

  try {
    const account = await getValidAccessToken(openId);
    const creator = await queryCreatorInfo(account.accessToken);
    return NextResponse.json({ creator });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not load creator info";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
