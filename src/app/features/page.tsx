import Image from "next/image";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaButton from "@/components/CtaButton";
import FaqSection from "@/components/FaqSection";
import {
  BRAND_FEATURE_2,
  BRAND_FEATURE_4,
  OG_IMAGE,
  SITE_NAME,
  SITE_ORIGIN,
} from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "TikTok Scheduler Features — Queue, Calendar & Auto-Publish",
  description:
    "Explore TikTok Scheduler features: content calendar, bulk upload, peak-time suggestions, captions, and auto-publish for creators and brands.",
  alternates: { canonical: `${SITE_ORIGIN}/features` },
  openGraph: {
    title: "TikTok Scheduler Features — Queue, Calendar & Auto-Publish",
    description: "Everything you need to plan and publish TikTok videos in advance.",
    url: `${SITE_ORIGIN}/features`,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "TikTok Scheduler features" }],
  },
};

const faqs = [
  {
    question: "Can I auto-publish TikTok videos?",
    answer:
      "Yes. Once a post is approved in your queue and your account permissions allow it, TikTok Scheduler publishes at the scheduled time without a manual tap.",
  },
  {
    question: "Does TikTok Scheduler support bulk scheduling?",
    answer:
      "Yes on the free plan — queue multiple posts with public video URLs and different publish times from the dashboard.",
  },
  {
    question: "Can I edit a scheduled TikTok before it goes live?",
    answer:
      "You can update captions, cover frames, and publish times on queued posts until the publish window starts.",
  },
];

const features = [
  {
    title: "Visual content calendar",
    body: "See the week or month at a glance. Drag posts between slots when trends shift, and keep campaigns aligned with launches or product drops.",
  },
  {
    title: "Auto-publish queue",
    body: "Approve once. TikTok Scheduler publishes when the clock hits — so you are not racing notifications from the TikTok app.",
  },
  {
    title: "Peak-time suggestions",
    body: "Use recommended windows informed by common creator patterns, then refine with your own analytics. Pair with our best-time guide for strategy.",
  },
  {
    title: "Captions & hashtags on desktop",
    body: "Write fuller captions, save hashtag groups, and preview how the post reads before it goes live.",
  },
  {
    title: "Bulk scheduling",
    body: "Queue many posts after a content day and assign different publish times — included on the free plan.",
  },
  {
    title: "Account-ready publishing",
    body: "Built around Professional TikTok accounts that support scheduling APIs — with clear prompts if reconnecting is needed.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Features" }]} />
      <h1 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
        Features built for a real TikTok publishing rhythm
      </h1>
      <p className="mb-10 max-w-3xl text-lg leading-relaxed text-white/80">
        {SITE_NAME} focuses on the jobs creators actually search for: schedule TikTok posts, keep a
        content calendar full, and auto-publish without babysitting drafts.
      </p>

      <div className="relative mb-14 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-brand-soft">
        <Image
          src={BRAND_FEATURE_2}
          alt="TikTok Scheduler feature overview — calendar and queue"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 960px"
          className="object-contain"
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {features.map((f) => (
          <article key={f.title} className="border-t border-violet/30 pt-5">
            <h2 className="mb-2 font-display text-xl font-semibold text-white">{f.title}</h2>
            <p className="leading-relaxed text-white/75">{f.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="mb-3 font-display text-2xl font-bold text-white">
            Designed for desktop planning, mobile-ready results
          </h2>
          <p className="leading-relaxed text-white/80">
            Film on your phone, schedule on a big screen. That split is how teams stay consistent while
            still creating native-feeling TikTok content.
          </p>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-brand-soft">
          <Image
            src={BRAND_FEATURE_4}
            alt="TikTok Scheduler desktop planning workspace"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
      </div>

      <FaqSection items={faqs} />

      <div className="mt-14 text-center">
        <CtaButton href="/dashboard" ariaLabel="Open free TikTok Scheduler dashboard">
          START FREE
        </CtaButton>
      </div>
    </div>
  );
}
