import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { getSessionSecret } from "@/lib/tiktok/config";

const COOKIE_NAME = "tts_session";
const OAUTH_COOKIE = "tts_oauth_state";
const MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

export type SessionPayload = {
  openId: string;
  exp: number;
};

type CookieOpts = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  maxAge?: number;
};

function cookieBase(): CookieOpts {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function encodeSession(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${sign(body)}`;
}

export function decodeSession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqual(sig, sign(body))) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as SessionPayload;
    if (!payload.openId || !payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Attach session cookie to a redirect/response (required on Vercel). */
export function attachSessionCookie(res: NextResponse, openId: string): void {
  const token = encodeSession({
    openId,
    exp: Date.now() + MAX_AGE_SEC * 1000,
  });
  res.cookies.set(COOKIE_NAME, token, {
    ...cookieBase(),
    maxAge: MAX_AGE_SEC,
  });
}

export async function setSession(openId: string): Promise<void> {
  const jar = await cookies();
  const token = encodeSession({
    openId,
    exp: Date.now() + MAX_AGE_SEC * 1000,
  });
  jar.set(COOKIE_NAME, token, {
    ...cookieBase(),
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    ...cookieBase(),
    maxAge: 0,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", {
    ...cookieBase(),
    maxAge: 0,
  });
}

export async function getSessionOpenId(): Promise<string | null> {
  const jar = await cookies();
  const payload = decodeSession(jar.get(COOKIE_NAME)?.value);
  return payload?.openId || null;
}

/**
 * Signed OAuth state — validates without relying on cookies surviving
 * the TikTok round-trip (fixes Invalid OAuth state on Vercel).
 * Format: nonce.timestamp.signature
 */
export function createOAuthState(): string {
  const nonce = randomBytes(16).toString("base64url");
  const ts = Date.now().toString(36);
  const payload = `${nonce}.${ts}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyOAuthState(state: string): boolean {
  if (!state) return false;
  const parts = state.split(".");
  if (parts.length !== 3) return false;
  const [nonce, ts, sig] = parts;
  if (!nonce || !ts || !sig) return false;
  const payload = `${nonce}.${ts}`;
  if (!safeEqual(sig, sign(payload))) return false;
  const created = parseInt(ts, 36);
  if (!Number.isFinite(created)) return false;
  // 15 minute window
  if (Date.now() - created > 15 * 60 * 1000) return false;
  if (created > Date.now() + 60 * 1000) return false;
  return true;
}

/** Optional cookie backup; attach on connect redirect. */
export function attachOAuthStateCookie(res: NextResponse, state: string): void {
  res.cookies.set(OAUTH_COOKIE, state, {
    ...cookieBase(),
    maxAge: 60 * 15,
  });
}

export function clearOAuthStateCookie(res: NextResponse): void {
  res.cookies.set(OAUTH_COOKIE, "", {
    ...cookieBase(),
    maxAge: 0,
  });
}

export async function consumeOAuthState(state: string): Promise<boolean> {
  // Primary: HMAC-signed state (works even if cookie was dropped)
  if (verifyOAuthState(state)) return true;

  // Fallback: cookie match (older flow)
  const jar = await cookies();
  const saved = jar.get(OAUTH_COOKIE)?.value;
  if (!saved || !state) return false;
  return safeEqual(saved, state);
}
