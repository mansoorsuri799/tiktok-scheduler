import { SITE_ORIGIN } from "@/lib/siteConfig";

export const TIKTOK_AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
export const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
export const TIKTOK_REVOKE_URL = "https://open.tiktokapis.com/v2/oauth/revoke/";
export const TIKTOK_USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/";
export const TIKTOK_VIDEO_INIT_URL =
  "https://open.tiktokapis.com/v2/post/publish/video/init/";

/** Free plan: one connected account, unlimited queued posts on this product. */
export const FREE_PLAN = {
  name: "Free",
  maxAccounts: 1,
  maxScheduledPosts: 500,
} as const;

/**
 * Scopes requested at connect time.
 * Sandbox tip: start with only `user.info.basic` until Login Kit + Content
 * Posting API are approved, then set:
 * TIKTOK_SCOPES=user.info.basic,video.upload,video.publish
 */
export function getTikTokScopes(): string {
  const fromEnv = process.env.TIKTOK_SCOPES?.trim();
  if (fromEnv) return fromEnv.replace(/\s+/g, "");
  return "user.info.basic,video.upload,video.publish";
}

/** @deprecated use getTikTokScopes() */
export const TIKTOK_SCOPES = "user.info.basic,video.upload,video.publish";

export function getTikTokClientKey(): string {
  return process.env.TIKTOK_CLIENT_KEY?.trim() || "";
}

export function getTikTokClientSecret(): string {
  return process.env.TIKTOK_CLIENT_SECRET?.trim() || "";
}

export function getTikTokRedirectUri(): string {
  return (
    process.env.TIKTOK_REDIRECT_URI?.trim() ||
    `${SITE_ORIGIN}/api/tiktok/callback`
  );
}

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret && secret.length >= 16) return secret;
  // Dev fallback — set SESSION_SECRET in production
  return "tiktok-scheduler-dev-secret-change-me";
}

export function isTikTokConfigured(): boolean {
  return Boolean(getTikTokClientKey() && getTikTokClientSecret());
}
