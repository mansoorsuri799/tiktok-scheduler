import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getSessionSecret } from "@/lib/tiktok/config";

const COOKIE_NAME = "tts_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

export type SessionPayload = {
  openId: string;
  exp: number;
};

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function encodeSession(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${sign(body)}`;
}

export function decodeSession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
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

export async function setSession(openId: string): Promise<void> {
  const jar = await cookies();
  const token = encodeSession({
    openId,
    exp: Date.now() + MAX_AGE_SEC * 1000,
  });
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionOpenId(): Promise<string | null> {
  const jar = await cookies();
  const payload = decodeSession(jar.get(COOKIE_NAME)?.value);
  return payload?.openId || null;
}

export function createOAuthState(): string {
  return randomBytes(24).toString("base64url");
}

export async function setOAuthState(state: string): Promise<void> {
  const jar = await cookies();
  jar.set("tts_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });
}

export async function consumeOAuthState(state: string): Promise<boolean> {
  const jar = await cookies();
  const saved = jar.get("tts_oauth_state")?.value;
  jar.set("tts_oauth_state", "", { httpOnly: true, path: "/", maxAge: 0 });
  if (!saved || !state) return false;
  const a = Buffer.from(saved);
  const b = Buffer.from(state);
  return a.length === b.length && timingSafeEqual(a, b);
}
