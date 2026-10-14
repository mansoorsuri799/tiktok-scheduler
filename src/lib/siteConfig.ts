export const SITE_NAME = "TikTok Scheduler";
export const SITE_SHORT_NAME = "Scheduler";
export const SITE_ORIGIN = "https://tiktokscheduler.net";
export const SITE_DOMAIN = "tiktokscheduler.net";
export const SITE_TAGLINE =
  "Plan, schedule, and auto-publish TikTok videos — queue posts for peak times, batch upload, and keep your content calendar full.";

export const CONTACT_EMAIL = "support@tiktokscheduler.net";

/** Bump this when replacing public images so browsers skip stale cached files. */
export const ASSET_VERSION = "20261014-tts1";

function metaAsset(path: string): string {
  return `${path}?v=${ASSET_VERSION}`;
}

/** Brand & content images in /public */
export const BRAND_LOGO = "/android-chrome-512x512.png";
export const BRAND_LOGO_MARK = "/logo-icon.png";
export const BRAND_LOGO_HORIZONTAL = "/logo-horizontal-white-text.png";
export const BRAND_LOGO_HORIZONTAL_DARK = "/logo-horizontal-dark-text.png";
export const BRAND_HERO = "/tiktok-scheduler-1.webp";
export const BRAND_FEATURE_2 = "/tiktok-scheduler-2.webp";
export const BRAND_FEATURE_3 = "/tiktok-scheduler-3.webp";
export const BRAND_FEATURE_4 = "/tiktok-scheduler-4.webp";
export const OG_IMAGE = metaAsset("/feature/og-image-1200x630.png");
export const TWITTER_IMAGE = metaAsset("/feature/twitter-card-1200x600.png");

/** Visible rating used for SoftwareApplication rich results */
export const SITE_RATING = {
  ratingValue: "4.8",
  ratingCount: "12840",
  bestRating: "5",
  worstRating: "1",
} as const;
