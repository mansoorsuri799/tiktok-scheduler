import { NextRequest, NextResponse } from "next/server";
import {
  countScheduledPosts,
  createPost,
  listPosts,
} from "@/lib/store/db";
import { getSessionOpenId } from "@/lib/store/session";
import { FREE_PLAN } from "@/lib/tiktok/config";
import { getValidAccessToken } from "@/lib/tiktok/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const openId = await getSessionOpenId();
  if (!openId) {
    return NextResponse.json({ error: "Connect TikTok first" }, { status: 401 });
  }
  const posts = await listPosts(openId);
  return NextResponse.json({ posts, plan: FREE_PLAN });
}

export async function POST(request: NextRequest) {
  const openId = await getSessionOpenId();
  if (!openId) {
    return NextResponse.json({ error: "Connect TikTok first" }, { status: 401 });
  }

  try {
    await getValidAccessToken(openId);
  } catch {
    return NextResponse.json(
      { error: "TikTok session expired. Reconnect your account." },
      { status: 401 }
    );
  }

  const body = (await request.json()) as {
    title?: string;
    videoUrl?: string;
    scheduledAt?: string;
    privacyLevel?: string;
  };

  const title = (body.title || "").trim();
  const videoUrl = (body.videoUrl || "").trim();
  const scheduledAt = (body.scheduledAt || "").trim();
  const privacyLevel = (body.privacyLevel ||
    "PUBLIC_TO_EVERYONE") as
    | "PUBLIC_TO_EVERYONE"
    | "MUTUAL_FOLLOW_FRIENDS"
    | "FOLLOWER_OF_CREATOR"
    | "SELF_ONLY";

  if (!title || title.length < 2) {
    return NextResponse.json({ error: "Caption/title is required" }, { status: 400 });
  }
  if (!videoUrl || !/^https:\/\//i.test(videoUrl)) {
    return NextResponse.json(
      { error: "A public https:// video URL is required for free-plan auto-publish" },
      { status: 400 }
    );
  }
  const when = new Date(scheduledAt);
  if (!scheduledAt || Number.isNaN(when.getTime()) || when.getTime() < Date.now() - 60_000) {
    return NextResponse.json(
      { error: "Choose a future date and time to schedule" },
      { status: 400 }
    );
  }

  const count = await countScheduledPosts(openId);
  if (count >= FREE_PLAN.maxScheduledPosts) {
    return NextResponse.json(
      { error: `Free plan allows up to ${FREE_PLAN.maxScheduledPosts} queued posts` },
      { status: 403 }
    );
  }

  const post = await createPost({
    openId,
    title,
    videoUrl,
    privacyLevel,
    scheduledAt: when.toISOString(),
  });

  return NextResponse.json({ post }, { status: 201 });
}
