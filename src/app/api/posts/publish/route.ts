import { NextRequest, NextResponse } from "next/server";
import { getSessionOpenId } from "@/lib/store/session";
import {
  fetchPublishStatus,
  getValidAccessToken,
  publishVideoPullFromUrl,
  queryCreatorInfo,
} from "@/lib/tiktok/client";

export const dynamic = "force-dynamic";

type Privacy =
  | "PUBLIC_TO_EVERYONE"
  | "MUTUAL_FOLLOW_FRIENDS"
  | "FOLLOWER_OF_CREATOR"
  | "SELF_ONLY";

/**
 * Immediate Direct Post (express consent). Used for TikTok audit demo + "Publish now".
 */
export async function POST(request: NextRequest) {
  const openId = await getSessionOpenId();
  if (!openId) {
    return NextResponse.json({ error: "Connect TikTok first" }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    videoUrl?: string;
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
      { error: "Confirm the TikTok posting agreement before publishing." },
      { status: 400 }
    );
  }

  const title = (body.title || "").trim();
  const videoUrl = (body.videoUrl || "").trim();
  const privacyLevel = (body.privacyLevel || "") as Privacy;
  const brandOrganic = Boolean(body.brandOrganic);
  const brandedContent = Boolean(body.brandedContent);

  if (!title || title.length < 2) {
    return NextResponse.json({ error: "Caption/title is required" }, { status: 400 });
  }
  if (!videoUrl || !/^https:\/\//i.test(videoUrl)) {
    return NextResponse.json(
      { error: "A public https:// video URL is required" },
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

  try {
    const account = await getValidAccessToken(openId);
    const creator = await queryCreatorInfo(account.accessToken);

    if (!creator.privacyLevelOptions.includes(privacyLevel)) {
      return NextResponse.json(
        { error: "Selected privacy option is not available for this account." },
        { status: 400 }
      );
    }

    const { publishId } = await publishVideoPullFromUrl({
      accessToken: account.accessToken,
      title,
      videoUrl,
      privacyLevel,
      allowComment: Boolean(body.allowComment) && !creator.commentDisabled,
      allowDuet: Boolean(body.allowDuet) && !creator.duetDisabled,
      allowStitch: Boolean(body.allowStitch) && !creator.stitchDisabled,
      brandOrganic,
      brandedContent,
    });

    let status = "PROCESSING_UPLOAD";
    try {
      status = await fetchPublishStatus(account.accessToken, publishId);
    } catch {
      // status poll optional; init already succeeded
    }

    return NextResponse.json({
      ok: true,
      publishId,
      status,
      notice:
        "After publishing, it may take a few minutes for the video to process and appear on your TikTok profile.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Publish failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
