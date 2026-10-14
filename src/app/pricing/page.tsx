import Image from "next/image";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaButton from "@/components/CtaButton";
import FaqSection from "@/components/FaqSection";
import { BRAND_FEATURE_4, OG_IMAGE, SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "TikTok Scheduler Pricing — Free Plan",
  description:
    "TikTok Scheduler is free: connect one TikTok account, queue posts, and auto-publish at peak times.",
  alternates: { canonical: `${SITE_ORIGIN}/pricing` },
  openGraph: {
    title: "TikTok Scheduler Pricing — Free Plan",
    description: "Use TikTok Scheduler free — connect TikTok and start scheduling.",
    url: `${SITE_ORIGIN}/pricing`,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "TikTok Scheduler free plan" }],
  },
};

const faqs = [
  {
    question: "Is TikTok Scheduler free?",
    answer:
      "Yes. The product runs on a free plan: connect one TikTok account, queue posts with public video URLs, and auto-publish on schedule.",
  },
  {
    question: "Do I need a paid plan to connect TikTok?",
    answer:
      "No. Connecting your TikTok account and scheduling posts works on the free plan.",
  },
  {
    question: "What do I need to schedule a post?",
    answer:
      "A Professional TikTok account connected via OAuth, a public https video URL TikTok can pull, and a future publish time.",
  },
];

const perks = [
  "1 connected TikTok account",
  "Schedule & auto-publish posts",
  "Content queue dashboard",
  "Peak-time publishing via cron runner",
  "No credit card required",
];

export default function PricingPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pricing" }]} />
      <h1 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
        Free plan — full scheduler
      </h1>
      <p className="mb-10 max-w-2xl text-lg text-white/80">
        {SITE_NAME} is free to use. Connect TikTok, fill your queue, and publish when your audience
        is online.
      </p>

      <div className="relative mb-12 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-brand-soft">
        <Image
          src={BRAND_FEATURE_4}
          alt="TikTok Scheduler free plan dashboard"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-contain"
        />
      </div>

      <div className="border border-violet bg-violet/10 p-8">
        <h2 className="font-display text-2xl font-bold text-white">Free</h2>
        <p className="mt-3 font-display text-4xl font-bold text-white">
          $0
          <span className="text-base font-medium text-white/60"> forever</span>
        </p>
        <p className="mt-3 text-white/75">
          Everything you need to schedule TikTok posts — included on day one.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-white/85">
          {perks.map((perk) => (
            <li key={perk} className="flex gap-2">
              <span className="text-teal" aria-hidden="true">
                ✓
              </span>
              {perk}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <CtaButton href="/dashboard" ariaLabel="Open free TikTok Scheduler dashboard">
            START FREE — CONNECT TIKTOK
          </CtaButton>
        </div>
      </div>

      <FaqSection items={faqs} />
    </div>
  );
}
