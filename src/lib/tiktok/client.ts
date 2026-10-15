import {
  getTikTokClientKey,
  getTikTokClientSecret,
  getTikTokRedirectUri,
  TIKTOK_AUTH_URL,
  TIKTOK_REVOKE_URL,
  getTikTokScopes,
  TIKTOK_TOKEN_URL,
  TIKTOK_USER_INFO_URL,
  TIKTOK_VIDEO_INIT_URL,
  TIKTOK_CREATOR_INFO_URL,
  TIKTOK_PUBLISH_STATUS_URL,
} from "@/lib/tiktok/config";
import type { TikTokAccount } from "@/lib/store/db";
import { getAccount, upsertAccount } from "@/lib/store/db";

// Account persistence is cookie-based (Vercel-safe). upsertAccount writes the cookie.

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  open_id?: string;
  refresh_expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
};

export function buildAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_key: getTikTokClientKey(),
    response_type: "code",
    scope: getTikTokScopes(),
    redirect_uri: getTikTokRedirectUri(),
    state,
  });
  return `${TIKTOK_AUTH_URL}?${params.toString()}`;
}

async function postForm(url: string, body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams(body),
    cache: "no-store",
  });
  return (await res.json()) as TokenResponse;
}

export async function exchangeCodeForTokens(code: string): Promise<TikTokAccount> {
  const data = await postForm(TIKTOK_TOKEN_URL, {
    client_key: getTikTokClientKey(),
    client_secret: getTikTokClientSecret(),
    code,
    grant_type: "authorization_code",
    redirect_uri: getTikTokRedirectUri(),
  });

  if (!data.access_token || !data.open_id || !data.refresh_token) {
    const detail = data.error_description || data.error || "Token exchange failed";
    // Common when Vercel secret doesn't match the Client key used at authorize time
    if (/client key|client_key|authorization record/i.test(detail)) {
      throw new Error(
        `${detail} Copy Client key + Client secret together from TikTok Credentials into Vercel, then Redeploy and Connect again.`
      );
    }
    throw new Error(detail);
  }

  const now = Date.now();
  const profile = await fetchUserProfile(data.access_token);
  const account: TikTokAccount = {
    openId: data.open_id,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessTokenExpiresAt: now + (data.expires_in || 86400) * 1000,
    refreshTokenExpiresAt: now + (data.refresh_expires_in || 31536000) * 1000,
    scope: data.scope || getTikTokScopes(),
    displayName: profile.displayName,
    avatarUrl: profile.avatarUrl,
    connectedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  // Caller (callback) must attachAccountCookie on the response for Vercel redirects.
  await upsertAccount(account);
  return account;
}

export async function refreshAccessToken(account: TikTokAccount): Promise<TikTokAccount> {
  const data = await postForm(TIKTOK_TOKEN_URL, {
    client_key: getTikTokClientKey(),
    client_secret: getTikTokClientSecret(),
    grant_type: "refresh_token",
    refresh_token: account.refreshToken,
  });

  if (!data.access_token || !data.refresh_token) {
    throw new Error(data.error_description || data.error || "Token refresh failed");
  }

  const now = Date.now();
  const next: TikTokAccount = {
    ...account,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessTokenExpiresAt: now + (data.expires_in || 86400) * 1000,
    refreshTokenExpiresAt: now + (data.refresh_expires_in || 31536000) * 1000,
    scope: data.scope || account.scope,
    updatedAt: new Date().toISOString(),
  };
  await upsertAccount(next);
  return next;
}

export async function getValidAccessToken(openId: string): Promise<TikTokAccount> {
  const account = await getAccount(openId);
  if (!account) throw new Error("TikTok account not connected");

  // Refresh 5 minutes before expiry
  if (account.accessTokenExpiresAt > Date.now() + 5 * 60 * 1000) {
    return account;
  }
  return refreshAccessToken(account);
}

export async function fetchUserProfile(accessToken: string): Promise<{
  displayName: string;
  avatarUrl: string;
}> {
  const url = new URL(TIKTOK_USER_INFO_URL);
  url.searchParams.set("fields", "open_id,union_id,avatar_url,display_name");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const json = (await res.json()) as {
    data?: { user?: { display_name?: string; avatar_url?: string } };
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new Error(json.error?.message || "Failed to load TikTok profile");
  }
  return {
    displayName: json.data?.user?.display_name || "TikTok user",
    avatarUrl: json.data?.user?.avatar_url || "",
  };
}

export async function revokeToken(accessToken: string): Promise<void> {
  await postForm(TIKTOK_REVOKE_URL, {
    client_key: getTikTokClientKey(),
    client_secret: getTikTokClientSecret(),
    token: accessToken,
  });
}

export type CreatorInfo = {
  creatorAvatarUrl: string;
  creatorUsername: string;
  creatorNickname: string;
  privacyLevelOptions: string[];
  commentDisabled: boolean;
  duetDisabled: boolean;
  stitchDisabled: boolean;
  maxVideoPostDurationSec: number;
};

export async function queryCreatorInfo(accessToken: string): Promise<CreatorInfo> {
  const res = await fetch(TIKTOK_CREATOR_INFO_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({}),
    cache: "no-store",
  });

  const json = (await res.json()) as {
    data?: {
      creator_avatar_url?: string;
      creator_username?: string;
      creator_nickname?: string;
      privacy_level_options?: string[];
      comment_disabled?: boolean;
      duet_disabled?: boolean;
      stitch_disabled?: boolean;
      max_video_post_duration_sec?: number;
    };
    error?: { code?: string; message?: string };
  };

  if (!res.ok || !json.data) {
    throw new Error(
      json.error?.message ||
        json.error?.code ||
        "Could not load TikTok creator info. Reconnect with video.publish scope."
    );
  }

  return {
    creatorAvatarUrl: json.data.creator_avatar_url || "",
    creatorUsername: json.data.creator_username || "",
    creatorNickname: json.data.creator_nickname || "TikTok creator",
    privacyLevelOptions: json.data.privacy_level_options || [],
    commentDisabled: Boolean(json.data.comment_disabled),
    duetDisabled: Boolean(json.data.duet_disabled),
    stitchDisabled: Boolean(json.data.stitch_disabled),
    maxVideoPostDurationSec: json.data.max_video_post_duration_sec || 600,
  };
}

export type PublishVideoOptions = {
  accessToken: string;
  title: string;
  videoUrl: string;
  privacyLevel: string;
  allowComment: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
  brandOrganic: boolean;
  brandedContent: boolean;
};

export async function publishVideoPullFromUrl(
  opts: PublishVideoOptions
): Promise<{ publishId: string }> {
  const res = await fetch(TIKTOK_VIDEO_INIT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      post_info: {
        title: opts.title.slice(0, 2200),
        privacy_level: opts.privacyLevel,
        disable_comment: !opts.allowComment,
        disable_duet: !opts.allowDuet,
        disable_stitch: !opts.allowStitch,
        brand_organic_toggle: opts.brandOrganic,
        brand_content_toggle: opts.brandedContent,
        video_cover_timestamp_ms: 1000,
      },
      source_info: {
        source: "PULL_FROM_URL",
        video_url: opts.videoUrl,
      },
    }),
    cache: "no-store",
  });

  const json = (await res.json()) as {
    data?: { publish_id?: string };
    error?: { code?: string; message?: string };
  };

  if (!res.ok || !json.data?.publish_id) {
    throw new Error(
      json.error?.message || json.error?.code || "TikTok publish failed"
    );
  }

  return { publishId: json.data.publish_id };
}

export async function fetchPublishStatus(
  accessToken: string,
  publishId: string
): Promise<string> {
  const res = await fetch(TIKTOK_PUBLISH_STATUS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ publish_id: publishId }),
    cache: "no-store",
  });
  const json = (await res.json()) as {
    data?: { status?: string };
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new Error(json.error?.message || "Could not fetch publish status");
  }
  return json.data?.status || "UNKNOWN";
}
