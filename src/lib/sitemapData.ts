import { SITE_ORIGIN } from "@/lib/siteConfig";

function imageLoc(path: string): string {
  return `${SITE_ORIGIN}${path}`;
}

export type SitemapPage = {
  path: string;
  lastMod: string;
  changeFreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  images?: Array<{ loc: string; title: string; caption: string }>;
};

const LASTMOD = "2026-10-14";

export const SITEMAP_PAGES: SitemapPage[] = [
  {
    path: "/",
    lastMod: LASTMOD,
    changeFreq: "daily",
    priority: 1,
    images: [
      {
        loc: imageLoc("/android-chrome-512x512.png"),
        title: "TikTok Scheduler logo",
        caption: "Brand mark for TikTok Scheduler on tiktokscheduler.net",
      },
      {
        loc: imageLoc("/tiktok-scheduler-2.webp"),
        title: "TikTok Scheduler calendar",
        caption: "Content calendar and queue for scheduling TikTok videos",
      },
    ],
  },
  {
    path: "/features",
    lastMod: LASTMOD,
    changeFreq: "weekly",
    priority: 0.95,
    images: [
      {
        loc: imageLoc("/tiktok-scheduler-2.webp"),
        title: "TikTok Scheduler features",
        caption: "Auto-publish, queue, and content calendar features for TikTok",
      },
    ],
  },
  {
    path: "/how-it-works",
    lastMod: LASTMOD,
    changeFreq: "weekly",
    priority: 0.9,
    images: [
      {
        loc: imageLoc("/tiktok-scheduler-3.webp"),
        title: "How TikTok Scheduler works",
        caption: "Connect, queue, and publish TikTok posts on a schedule",
      },
    ],
  },
  {
    path: "/pricing",
    lastMod: LASTMOD,
    changeFreq: "weekly",
    priority: 0.9,
    images: [
      {
        loc: imageLoc("/tiktok-scheduler-4.webp"),
        title: "TikTok Scheduler pricing",
        caption: "Free plan for scheduling TikTok posts",
      },
    ],
  },
  {
    path: "/about-us",
    lastMod: LASTMOD,
    changeFreq: "monthly",
    priority: 0.7,
    images: [
      {
        loc: imageLoc("/android-chrome-512x512.png"),
        title: "About TikTok Scheduler",
        caption: "Brand logo used on the About page",
      },
    ],
  },
  {
    path: "/blog",
    lastMod: LASTMOD,
    changeFreq: "weekly",
    priority: 0.8,
  },
  {
    path: "/blog/how-to-schedule-tiktok-posts",
    lastMod: LASTMOD,
    changeFreq: "monthly",
    priority: 0.85,
    images: [
      {
        loc: imageLoc("/tiktok-scheduler-1.webp"),
        title: "How to schedule TikTok posts",
        caption: "Step-by-step guide to scheduling TikTok videos on mobile and desktop",
      },
    ],
  },
  {
    path: "/blog/best-time-to-post-on-tiktok",
    lastMod: LASTMOD,
    changeFreq: "monthly",
    priority: 0.85,
    images: [
      {
        loc: imageLoc("/tiktok-scheduler-2.webp"),
        title: "Best time to post on TikTok",
        caption: "Peak posting windows and how to find your best TikTok schedule",
      },
    ],
  },
  {
    path: "/blog/tiktok-content-calendar",
    lastMod: LASTMOD,
    changeFreq: "monthly",
    priority: 0.8,
    images: [
      {
        loc: imageLoc("/tiktok-scheduler-3.webp"),
        title: "TikTok content calendar",
        caption: "Build a TikTok content calendar and schedule posts in advance",
      },
    ],
  },
  {
    path: "/blog/does-tiktok-have-a-scheduler",
    lastMod: LASTMOD,
    changeFreq: "monthly",
    priority: 0.8,
    images: [
      {
        loc: imageLoc("/tiktok-scheduler-4.webp"),
        title: "Does TikTok have a scheduler",
        caption: "Native TikTok Video Scheduler vs third-party TikTok scheduling tools",
      },
    ],
  },
  {
    path: "/contact-us",
    lastMod: LASTMOD,
    changeFreq: "yearly",
    priority: 0.6,
  },
  {
    path: "/privacy",
    lastMod: LASTMOD,
    changeFreq: "yearly",
    priority: 0.4,
  },
  {
    path: "/disclaimer",
    lastMod: LASTMOD,
    changeFreq: "yearly",
    priority: 0.4,
  },
];

export function absoluteUrl(path: string): string {
  if (path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path}`;
}
