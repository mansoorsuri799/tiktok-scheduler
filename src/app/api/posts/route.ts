import { NextRequest, NextResponse } from "next/server";
import {
  countScheduledPosts,
  createPost,
  listPosts,
} from "@/lib/store/db";
import { getSessionOpenId } from "@/lib/store/session";
import { FREE_PLAN } from "@/lib/tiktok/config";
import { getValidAccessToken, queryCreatorInfo } from "@/lib/tiktok/client";

export const dynamic = "force-dynamic";

type Privacy =
  | "PUBLIC_TO_EVERYONE"
  | "MUTUAL_FOLLOW_FRIENDS"
  | "FOLLOWER_OF_CREATOR"
  | "SELF_ONLY";

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
    allowComment?: boolean;
    allowDuet?: boolean;
    allowStitch?: boolean;
    brandOrganic?: boolean;
    brandedContent?: boolean;
    consented?: boolean;
  };

  if (!body.consented) {
    return NextResponse.json(
      { error: "Confirm the TikTok posting agreement before queuing." },
      { status: 400 }
    );
  }

  const title = (body.title || "").trim();
  const videoUrl = (body.videoUrl || "").trim();
  const scheduledAt = (body.scheduledAt || "").trim();
  const privacyLevel = (body.privacyLevel || "") as Privacy;
  const brandOrganic = Boolean(body.brandOrganic);
  const brandedContent = Boolean(body.brandedContent);

  if (!title || title.length < 2) {
    return NextResponse.json({ error: "Caption/title is required" }, { status: 400 });
  }
  if (!videoUrl || !/^https:\/\//i.test(videoUrl)) {
    return NextResponse.json(
      { error: "A public https:// video URL is required for free-plan auto-publish" },
      { status: 400 }
    );
  }
  if (!privacyLevel) {
    return NextResponse.json(
      { error: "Select who can view this post" },
      { status: 400 }
    );
  }
  if (brandedContent && privacyLevel === "SELF_ONLY") {
    return NextResponse.json(
      { error: "Branded content visibility cannot be set to private." },
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

  try {
    const account = await getValidAccessToken(openId);
    const creator = await queryCreatorInfo(account.accessToken);
    if (
      creator.privacyLevelOptions.length > 0 &&
      !creator.privacyLevelOptions.includes(privacyLevel)
    ) {
      return NextResponse.json(
        { error: "Selected privacy option is not available for this account." },
        { status: 400 }
      );
    }
  } catch {
    // Allow queue if creator_info is unavailable (scopes pending); publish will re-check.
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
    allowComment: Boolean(body.allowComment),
    allowDuet: Boolean(body.allowDuet),
    allowStitch: Boolean(body.allowStitch),
    brandOrganic,
    brandedContent,
    scheduledAt: when.toISOString(),
  });

  return NextResponse.json({ post }, { status: 201 });
}
