import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/tiktok/client";
import {
  attachSessionCookie,
  clearOAuthStateCookie,
  consumeOAuthState,
} from "@/lib/store/session";
import { SITE_ORIGIN } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "";

  if (error) {
    return NextResponse.redirect(
      `${SITE_ORIGIN}/dashboard?error=${encodeURIComponent(
        errorDescription || error
      )}`,
      302
    );
  }

  const stateOk = await consumeOAuthState(state);
  if (!stateOk) {
    return NextResponse.redirect(
      `${SITE_ORIGIN}/dashboard?error=${encodeURIComponent(
        "Invalid OAuth state. Please try connecting again."
      )}`,
      302
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${SITE_ORIGIN}/dashboard?error=${encodeURIComponent(
        "Missing authorization code from TikTok."
      )}`,
      302
    );
  }

  try {
    const account = await exchangeCodeForTokens(code);
    const res = NextResponse.redirect(`${SITE_ORIGIN}/dashboard?connected=1`, 302);
    attachSessionCookie(res, account.openId);
    clearOAuthStateCookie(res);
    return res;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to connect TikTok account";
    return NextResponse.redirect(
      `${SITE_ORIGIN}/dashboard?error=${encodeURIComponent(message)}`,
      302
    );
  }
}
