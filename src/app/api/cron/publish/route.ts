import { NextRequest, NextResponse } from "next/server";
import { getDuePosts, updatePost } from "@/lib/store/db";
import {
  getValidAccessToken,
  publishVideoPullFromUrl,
} from "@/lib/tiktok/client";

export const dynamic = "force-dynamic";

/**
 * Publish due scheduled posts.
 * Call every minute from a cron job:
 *   Authorization: Bearer $CRON_SECRET
 *   GET/POST /api/cron/publish
 */
export async function GET(request: NextRequest) {
  return runPublish(request);
}

export async function POST(request: NextRequest) {
  return runPublish(request);
}

async function runPublish(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  // Allow local/dev without secret; require secret when configured
  if (secret && token !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await getDuePosts();
  const results: Array<{ id: string; ok: boolean; error?: string }> = [];

  for (const post of due) {
    await updatePost(post.id, { status: "publishing", error: undefined });
    try {
      const account = await getValidAccessToken(post.openId);
      const { publishId } = await publishVideoPullFromUrl({
        accessToken: account.accessToken,
        title: post.title,
        videoUrl: post.videoUrl,
        privacyLevel: post.privacyLevel,
      });
      await updatePost(post.id, {
        status: "published",
        publishId,
        error: undefined,
      });
      results.push({ id: post.id, ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Publish failed";
      await updatePost(post.id, { status: "failed", error: message });
      results.push({ id: post.id, ok: false, error: message });
    }
  }

  return NextResponse.json({
    processed: results.length,
    results,
  });
}
