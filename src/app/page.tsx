import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import FaqSection from "@/components/FaqSection";
import CtaButton from "@/components/CtaButton";
import { WEB_APPLICATION_JSON_LD } from "@/lib/appFacts";
import { imageObjectLicensing } from "@/lib/schemaImageLicensing";
import {
  BRAND_FEATURE_2,
  BRAND_FEATURE_3,
  BRAND_HERO,
  BRAND_LOGO,
  OG_IMAGE,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_RATING,
} from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: {
    default: "TikTok Scheduler — Plan & Auto-Publish TikTok Videos",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "TikTok Scheduler helps creators and brands plan, queue, and auto-publish TikTok videos at the best times — desktop-friendly content calendar included.",
  alternates: { canonical: SITE_ORIGIN },
  openGraph: {
    title: "TikTok Scheduler — Plan & Auto-Publish TikTok Videos",
    description:
      "Schedule TikTok posts in advance, batch your queue, and publish when your audience is online.",
    url: SITE_ORIGIN,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "TikTok Scheduler homepage — plan and publish TikTok videos",
      },
    ],
  },
};

const faqs = [
  {
    question: "What is TikTok Scheduler?",
    answer:
      "TikTok Scheduler is a web tool for planning TikTok videos ahead of time. Upload clips, set captions, pick publish times, and auto-publish so you stay consistent without living in the TikTok app.",
  },
  {
    question: "Can I schedule TikTok posts for free?",
    answer:
      "Yes. TikTok Scheduler includes a free plan to queue posts and learn the workflow. Paid plans unlock more scheduled posts, bulk uploads, and team seats — see Pricing for current limits.",
  },
  {
    question: "Does scheduling hurt TikTok reach?",
    answer:
      "Scheduling itself does not hurt reach when you publish through approved APIs and post at times your audience is active. Consistency and creative quality matter more than tapping Post manually every time.",
  },
  {
    question: "Do I need a TikTok Business or Creator account?",
    answer:
      "Most scheduling features work with Professional (Creator or Business) accounts that allow third-party publishing. Connect your account on the start flow and we will confirm what your account type supports.",
  },
  {
    question: "How is this different from TikTok’s native Video Scheduler?",
    answer:
      "TikTok’s built-in scheduler is useful for short windows inside Studio. TikTok Scheduler adds a fuller content calendar, longer planning horizon, bulk queueing, and guides for best posting times — see our native vs tool comparison guide.",
  },
];

export default function Home() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name: SITE_NAME,
        description:
          "Plan, schedule, and auto-publish TikTok videos with a content calendar built for creators.",
        inLanguage: "en-US",
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_ORIGIN}/#webpage`,
        url: `${SITE_ORIGIN}/`,
        name: "TikTok Scheduler — Plan & Auto-Publish TikTok Videos",
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_ORIGIN}${BRAND_HERO}`,
          width: 1600,
          height: 900,
          ...imageObjectLicensing,
        },
      },
      {
        ...WEB_APPLICATION_JSON_LD,
        "@id": `${SITE_ORIGIN}/#software`,
        description:
          "Web-based TikTok post scheduler with queue, calendar, and auto-publish.",
      },
      {
        "@type": "HowTo",
        name: "How to schedule TikTok posts with TikTok Scheduler",
        description: "Connect your account, queue videos, and publish on a schedule.",
        step: [
          {
            "@type": "HowToStep",
            name: "Connect TikTok",
            text: "Sign in and securely connect your Professional TikTok account.",
          },
          {
            "@type": "HowToStep",
            name: "Upload and caption",
            text: "Add videos, write captions and hashtags, then preview the post.",
          },
          {
            "@type": "HowToStep",
            name: "Pick a time",
            text: "Choose a date and time — or use recommended peak windows for your audience.",
          },
          {
            "@type": "HowToStep",
            name: "Auto-publish",
            text: "Save to the queue. TikTok Scheduler publishes when the slot arrives.",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Hero — one composition: brand, headline, support, CTA, full-bleed visual */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={BRAND_HERO}
            alt="TikTok Scheduler dashboard for planning and publishing TikTok videos"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/85 to-brand/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand via-transparent to-brand/50" />
          <div className="hero-glow pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-violet/40 blur-3xl" />
          <div className="hero-glow pointer-events-none absolute -right-10 bottom-20 h-72 w-72 rounded-full bg-pink/30 blur-3xl" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <p className="mb-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl animate-fade-up">
            <span className="brand-gradient-text">{SITE_NAME}</span>
          </p>
          <h1 className="mb-5 max-w-2xl font-display text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl animate-fade-up" style={{ animationDelay: "80ms" }}>
            Plan TikTok videos once. Publish when your audience is ready.
          </h1>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg animate-fade-up" style={{ animationDelay: "140ms" }}>
            Queue posts, build a content calendar, and auto-publish TikToks at peak times — without juggling drafts in the mobile app.
          </p>
          <div id="start" className="flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <CtaButton href="/pricing" ariaLabel="Start scheduling with TikTok Scheduler" icon="play">
              START SCHEDULING
            </CtaButton>
            <Link
              href="/how-it-works"
              className="text-sm font-semibold text-violet-soft underline-offset-4 hover:underline"
            >
              See how it works →
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/70 animate-fade-up" style={{ animationDelay: "260ms" }}>
            <span className="inline-flex items-center gap-1.5" aria-label={`Rated ${SITE_RATING.ratingValue} out of 5`}>
              <span className="font-semibold text-gold">{SITE_RATING.ratingValue}</span>
              <span className="tracking-tight text-gold" aria-hidden="true">★★★★★</span>
              <span>({Number(SITE_RATING.ratingCount).toLocaleString()})</span>
            </span>
            <span className="text-white/40">·</span>
            <span>Free plan</span>
            <span className="text-white/40">·</span>
            <span>Web</span>
            <span className="text-white/40">·</span>
            <span>Creators & brands</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-16">
        <section className="mb-20">
          <h2 className="mb-4 font-display text-2xl font-bold text-white md:text-3xl">
            Why creators use a TikTok post scheduler
          </h2>
          <p className="mb-10 max-w-3xl text-lg leading-relaxed text-white/80">
            Posting every day is hard when inspiration hits at midnight and your audience wakes at 7 a.m.
            A dedicated <strong className="font-semibold text-white">TikTok scheduler</strong> turns
            batch filming into a calm calendar — so growth comes from consistency, not last-minute taps.
          </p>
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={BRAND_FEATURE_2}
                alt="TikTok Scheduler calendar view for queued video posts"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <ul className="space-y-5 text-white/85">
              {[
                {
                  title: "Post at peak times",
                  body: "Lock slots that match when your followers are online, then let auto-publish handle the rest.",
                },
                {
                  title: "Batch once, publish all week",
                  body: "Film in a single session, upload in bulk, and fill your TikTok content calendar without daily stress.",
                },
                {
                  title: "Desktop-first workflow",
                  body: "Write longer captions, organize hashtags, and preview posts on a full screen before they go live.",
                },
              ].map((item) => (
                <li key={item.title}>
                  <h3 className="mb-1 font-display text-lg font-semibold text-white">{item.title}</h3>
                  <p className="leading-relaxed text-white/75">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="mb-4 font-display text-2xl font-bold text-white md:text-3xl">
            How TikTok Scheduler works
          </h2>
          <p className="mb-10 max-w-3xl text-white/80">
            Four steps from draft to published — the same flow covered in our{" "}
            <Link href="/how-it-works" className="text-violet-soft underline hover:no-underline">
              how it works
            </Link>{" "}
            guide and the{" "}
            <Link href="/blog/how-to-schedule-tiktok-posts" className="text-violet-soft underline hover:no-underline">
              how to schedule TikTok posts
            </Link>{" "}
            article.
          </p>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", t: "Connect", d: "Link your Professional TikTok account securely." },
              { n: "02", t: "Upload", d: "Add videos, captions, covers, and hashtags." },
              { n: "03", t: "Schedule", d: "Pick exact times or suggested peak windows." },
              { n: "04", t: "Publish", d: "Auto-publish from your queue when the slot hits." },
            ].map((step) => (
              <li key={step.n} className="border-t border-violet/40 pt-4">
                <span className="font-display text-sm font-bold text-pink">{step.n}</span>
                <h3 className="mt-2 font-display text-xl font-semibold text-white">{step.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{step.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-20 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mb-4 font-display text-2xl font-bold text-white md:text-3xl">
              Built for the searches that matter
            </h2>
            <p className="mb-6 leading-relaxed text-white/80">
              People searching for a TikTok scheduler also want best posting times, content calendars,
              and clarity on TikTok’s native Video Scheduler. We cover those intents in product pages
              and SERP-backed guides — not filler blogs.
            </p>
            <ul className="space-y-3">
              {[
                { href: "/features", label: "Product features" },
                { href: "/blog/best-time-to-post-on-tiktok", label: "Best time to post on TikTok" },
                { href: "/blog/tiktok-content-calendar", label: "TikTok content calendar" },
                { href: "/blog/does-tiktok-have-a-scheduler", label: "Does TikTok have a scheduler?" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-medium text-violet-soft hover:underline">
                    {link.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={BRAND_FEATURE_3}
              alt="TikTok Scheduler posting timeline and auto-publish queue"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        <FaqSection title="TikTok Scheduler FAQs" items={faqs} />

        <section className="mt-16 border-t border-white/10 pt-12 text-center">
          <div className="mx-auto mb-6 relative h-16 w-16">
            <Image src={BRAND_LOGO} alt="" width={64} height={64} className="object-contain" />
          </div>
          <h2 className="mb-3 font-display text-2xl font-bold text-white md:text-3xl">
            Ready to fill your TikTok calendar?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-white/75">
            Start on the free plan, queue your next week of videos, and publish when engagement is highest.
          </p>
          <CtaButton href="/pricing" ariaLabel="View TikTok Scheduler pricing" icon="arrow">
            VIEW PLANS
          </CtaButton>
        </section>
      </div>
    </>
  );
}
