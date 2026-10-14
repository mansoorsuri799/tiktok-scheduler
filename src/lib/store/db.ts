import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

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
  scheduledAt: string;
  status: "scheduled" | "publishing" | "published" | "failed";
  publishId?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
};

type DbShape = {
  accounts: Record<string, TikTokAccount>;
  posts: ScheduledPost[];
};

const DATA_DIR = process.env.DATA_DIR?.trim() || path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "store.json");

async function ensureDb(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DB_FILE);
  } catch {
    const empty: DbShape = { accounts: {}, posts: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(empty, null, 2), "utf8");
  }
}

async function readDb(): Promise<DbShape> {
  await ensureDb();
  const raw = await fs.readFile(DB_FILE, "utf8");
  const parsed = JSON.parse(raw) as DbShape;
  return {
    accounts: parsed.accounts || {},
    posts: Array.isArray(parsed.posts) ? parsed.posts : [],
  };
}

async function writeDb(db: DbShape): Promise<void> {
  await ensureDb();
  const tmp = `${DB_FILE}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_FILE);
}

export async function upsertAccount(account: TikTokAccount): Promise<void> {
  const db = await readDb();
  db.accounts[account.openId] = account;
  await writeDb(db);
}

export async function getAccount(openId: string): Promise<TikTokAccount | null> {
  const db = await readDb();
  return db.accounts[openId] || null;
}

export async function deleteAccount(openId: string): Promise<void> {
  const db = await readDb();
  delete db.accounts[openId];
  db.posts = db.posts.filter((p) => p.openId !== openId);
  await writeDb(db);
}

export async function listPosts(openId: string): Promise<ScheduledPost[]> {
  const db = await readDb();
  return db.posts
    .filter((p) => p.openId === openId)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
}

export async function countScheduledPosts(openId: string): Promise<number> {
  const db = await readDb();
  return db.posts.filter(
    (p) => p.openId === openId && (p.status === "scheduled" || p.status === "publishing")
  ).length;
}

export async function createPost(
  input: Omit<ScheduledPost, "id" | "status" | "createdAt" | "updatedAt">
): Promise<ScheduledPost> {
  const db = await readDb();
  const now = new Date().toISOString();
  const post: ScheduledPost = {
    ...input,
    id: randomUUID(),
    status: "scheduled",
    createdAt: now,
    updatedAt: now,
  };
  db.posts.push(post);
  await writeDb(db);
  return post;
}

export async function deletePost(openId: string, id: string): Promise<boolean> {
  const db = await readDb();
  const before = db.posts.length;
  db.posts = db.posts.filter(
    (p) => !(p.id === id && p.openId === openId && p.status === "scheduled")
  );
  if (db.posts.length === before) return false;
  await writeDb(db);
  return true;
}

export async function getDuePosts(now = Date.now()): Promise<ScheduledPost[]> {
  const db = await readDb();
  return db.posts.filter(
    (p) => p.status === "scheduled" && new Date(p.scheduledAt).getTime() <= now
  );
}

export async function updatePost(
  id: string,
  patch: Partial<ScheduledPost>
): Promise<ScheduledPost | null> {
  const db = await readDb();
  const idx = db.posts.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  db.posts[idx] = {
    ...db.posts[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeDb(db);
  return db.posts[idx];
}
