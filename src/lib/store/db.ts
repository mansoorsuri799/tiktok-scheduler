import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { sealJson, unsealJson } from "@/lib/store/crypto";

export type TikTokAccount = {
  openId: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
  scope: string;
  displayName: string;
  avatarUrl: string;
  connectedAt: string;
  updatedAt: string;
};

export type ScheduledPost = {
  id: string;
  openId: string;
  title: string;
  videoUrl: string;
  privacyLevel:
    | "PUBLIC_TO_EVERYONE"
    | "MUTUAL_FOLLOW_FRIENDS"
    | "FOLLOWER_OF_CREATOR"
    | "SELF_ONLY";
  allowComment: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
  brandOrganic: boolean;
  brandedContent: boolean;
  scheduledAt: string;
  status: "scheduled" | "publishing" | "published" | "failed";
  publishId?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
};

const ACCOUNT_COOKIE = "tts_account";
const POSTS_COOKIE = "tts_posts";
const MAX_AGE = 60 * 60 * 24 * 30;

function cookieOpts(maxAge = MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

async function readAccountCookie(): Promise<TikTokAccount | null> {
  const jar = await cookies();
  return unsealJson<TikTokAccount>(jar.get(ACCOUNT_COOKIE)?.value);
}

async function readPostsCookie(): Promise<ScheduledPost[]> {
  const jar = await cookies();
  return unsealJson<ScheduledPost[]>(jar.get(POSTS_COOKIE)?.value) || [];
}

async function writeAccountCookie(account: TikTokAccount | null): Promise<void> {
  const jar = await cookies();
  if (!account) {
    jar.set(ACCOUNT_COOKIE, "", { ...cookieOpts(0), maxAge: 0 });
    return;
  }
  jar.set(ACCOUNT_COOKIE, sealJson(account), cookieOpts());
}

async function writePostsCookie(posts: ScheduledPost[]): Promise<void> {
  const jar = await cookies();
  jar.set(POSTS_COOKIE, sealJson(posts), cookieOpts());
}

/** Attach encrypted account cookie to a redirect/JSON response (Vercel-safe). */
export function attachAccountCookie(res: NextResponse, account: TikTokAccount): void {
  res.cookies.set(ACCOUNT_COOKIE, sealJson(account), cookieOpts());
}

export function clearAccountCookie(res: NextResponse): void {
  res.cookies.set(ACCOUNT_COOKIE, "", { ...cookieOpts(0), maxAge: 0 });
  res.cookies.set(POSTS_COOKIE, "", { ...cookieOpts(0), maxAge: 0 });
}

export async function upsertAccount(account: TikTokAccount): Promise<void> {
  await writeAccountCookie(account);
}

export async function getAccount(openId: string): Promise<TikTokAccount | null> {
  const account = await readAccountCookie();
  if (!account || account.openId !== openId) return null;
  return account;
}

export async function deleteAccount(openId: string): Promise<void> {
  const account = await readAccountCookie();
  if (account?.openId === openId) {
    await writeAccountCookie(null);
  }
  const posts = (await readPostsCookie()).filter((p) => p.openId !== openId);
  await writePostsCookie(posts);
}

export async function listPosts(openId: string): Promise<ScheduledPost[]> {
  return (await readPostsCookie())
    .filter((p) => p.openId === openId)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
}

export async function countScheduledPosts(openId: string): Promise<number> {
  return (await readPostsCookie()).filter(
    (p) => p.openId === openId && (p.status === "scheduled" || p.status === "publishing")
  ).length;
}

export async function createPost(
  input: Omit<ScheduledPost, "id" | "status" | "createdAt" | "updatedAt">
): Promise<ScheduledPost> {
  const posts = await readPostsCookie();
  const now = new Date().toISOString();
  const post: ScheduledPost = {
    ...input,
    id: randomUUID(),
    status: "scheduled",
    createdAt: now,
    updatedAt: now,
  };
  posts.push(post);
  await writePostsCookie(posts);
  return post;
}

export async function deletePost(openId: string, id: string): Promise<boolean> {
  const posts = await readPostsCookie();
  const next = posts.filter(
    (p) => !(p.id === id && p.openId === openId && p.status === "scheduled")
  );
  if (next.length === posts.length) return false;
  await writePostsCookie(next);
  return true;
}

export async function getDuePosts(now = Date.now()): Promise<ScheduledPost[]> {
  // Cookie store is per-user; cron has no user cookies.
  // Due publishing for serverless needs a shared DB later (e.g. Upstash).
  return (await readPostsCookie()).filter(
    (p) => p.status === "scheduled" && new Date(p.scheduledAt).getTime() <= now
  );
}

export async function updatePost(
  id: string,
  patch: Partial<ScheduledPost>
): Promise<ScheduledPost | null> {
  const posts = await readPostsCookie();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  posts[idx] = {
    ...posts[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writePostsCookie(posts);
  return posts[idx];
}
