import { NextResponse } from "next/server";
import { getAccount, deleteAccount } from "@/lib/store/db";
import { clearSession, getSessionOpenId } from "@/lib/store/session";
import { revokeToken } from "@/lib/tiktok/client";

export const dynamic = "force-dynamic";

export async function POST() {
  const openId = await getSessionOpenId();
  if (!openId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const account = await getAccount(openId);
  if (account) {
    try {
      await revokeToken(account.accessToken);
    } catch {
      // Still clear local data if revoke fails
    }
    await deleteAccount(openId);
  }

  await clearSession();
  return NextResponse.json({ ok: true });
}
