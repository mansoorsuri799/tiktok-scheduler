import { NextResponse } from "next/server";
import { isTikTokConfigured } from "@/lib/tiktok/config";
import { buildAuthorizeUrl } from "@/lib/tiktok/client";
import { attachOAuthStateCookie, createOAuthState } from "@/lib/store/session";
import { SITE_ORIGIN } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isTikTokConfigured()) {
    return NextResponse.redirect(
      `${SITE_ORIGIN}/dashboard?error=${encodeURIComponent(
        "TikTok API credentials are not configured. Add TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET to the server environment."
      )}`,
      302
    );
  }

  const state = createOAuthState();
  const res = NextResponse.redirect(buildAuthorizeUrl(state), 302);
  // Set cookie on the redirect response (cookies() alone often drops on Vercel)
  attachOAuthStateCookie(res, state);
  return res;
}
