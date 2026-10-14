import { NextResponse } from "next/server";
import { getAccount } from "@/lib/store/db";
import { getSessionOpenId } from "@/lib/store/session";
import { getValidAccessToken, fetchUserProfile } from "@/lib/tiktok/client";
import { FREE_PLAN, isTikTokConfigured } from "@/lib/tiktok/config";
import { upsertAccount } from "@/lib/store/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = isTikTokConfigured();
  const openId = await getSessionOpenId();

  if (!openId) {
    return NextResponse.json({
      configured,
      connected: false,
      plan: FREE_PLAN,
    });
  }

  try {
    const account = await getValidAccessToken(openId);
    // Refresh profile display occasionally
    try {
      const profile = await fetchUserProfile(account.accessToken);
      if (
        profile.displayName !== account.displayName ||
        profile.avatarUrl !== account.avatarUrl
      ) {
        account.displayName = profile.displayName;
        account.avatarUrl = profile.avatarUrl;
        account.updatedAt = new Date().toISOString();
        await upsertAccount(account);
      }
    } catch {
      // keep stored profile
    }

    return NextResponse.json({
      configured,
      connected: true,
      plan: FREE_PLAN,
      account: {
        openId: account.openId,
        displayName: account.displayName,
        avatarUrl: account.avatarUrl,
        scope: account.scope,
        connectedAt: account.connectedAt,
      },
    });
  } catch {
    const stale = await getAccount(openId);
    return NextResponse.json({
      configured,
      connected: Boolean(stale),
      plan: FREE_PLAN,
      account: stale
        ? {
            openId: stale.openId,
            displayName: stale.displayName,
            avatarUrl: stale.avatarUrl,
            scope: stale.scope,
            connectedAt: stale.connectedAt,
          }
        : null,
      warning: "Token refresh failed. Reconnect your TikTok account.",
    });
  }
}
