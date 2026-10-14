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
} from "@/lib/tiktok/config";
import type { TikTokAccount } from "@/lib/store/db";
import { getAccount, upsertAccount } from "@/lib/store/db";

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
    throw new Error(data.error_description || data.error || "Token exchange failed");
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

export async function publishVideoPullFromUrl(opts: {
  accessToken: string;
  title: string;
  videoUrl: string;
  privacyLevel: string;
}): Promise<{ publishId: string }> {
  const res = await fetch(TIKTOK_VIDEO_INIT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post_info: {
        title: opts.title.slice(0, 2200),
        privacy_level: opts.privacyLevel,
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
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
