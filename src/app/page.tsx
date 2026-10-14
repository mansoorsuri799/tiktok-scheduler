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
  BRAND_FEATURE_4,
  BRAND_LOGO,
  OG_IMAGE,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_RATING,
} from "@/lib/siteConfig";

const homeFeatures = [
  {
    title: "Content calendar",
    body: "See your week or month of TikToks in one view. Move posts between slots when a trend shifts or a product launch moves.",
  },
  {
    title: "Auto-publish queue",
    body: "Approve captions and covers once. TikTok Scheduler publishes at the scheduled time so you are not racing app notifications.",
  },
  {
    title: "Peak-time scheduling",
    body: "Pick exact times or start from suggested windows when your audience is more likely to be online.",
  },
  {
    title: "Bulk upload",
    body: "After a filming day, upload multiple videos and assign publish times across the week in one pass.",
  },
  {
    title: "Desktop captions & hashtags",
    body: "Write fuller captions, reuse hashtag sets, and preview how each post reads before it goes live.",
  },
  {
    title: "Professional account ready",
    body: "Built for Creator and Business accounts with publishing permissions, plus clear reconnect prompts if a token expires.",
  },
];

const howToUseSteps = [
  {
    n: "01",
    t: "Open the free dashboard",
    d: "Go to /dashboard — TikTok Scheduler is free. No paid plan is required to connect or schedule.",
  },
  {
    n: "02",
    t: "Connect TikTok",
    d: "Authorize a Professional (Creator or Business) TikTok account so publish permissions are available.",
  },
  {
    n: "03",
    t: "Add video URL and caption",
    d: "Paste a public https MP4 URL, write your caption, and choose privacy settings.",
  },
  {
    n: "04",
    t: "Pick publish times",
    d: "Set the date and time for each post so it goes live when your audience is online.",
  },
  {
    n: "05",
    t: "Auto-publish",
    d: "When the slot arrives, the publish runner posts through TikTok’s API. Cancel anytime before go-live.",
  },
];

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
      "Yes. TikTok Scheduler is free: connect one TikTok account, queue posts with public video URLs, and auto-publish on schedule from the dashboard.",
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
          url: `${SITE_ORIGIN}${BRAND_LOGO}`,
          width: 512,
          height: 512,
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
        name: "How to use TikTok Scheduler",
        description: "Create an account, connect TikTok, queue videos, and auto-publish on a schedule.",
        step: howToUseSteps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.t,
          text: step.d,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Hero — brand, headline, support, CTA on clean atmosphere (no busy bg image) */}
      <section className="relative min-h-[72vh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-soft/80 via-brand to-brand" />
          <div className="hero-glow absolute -left-24 top-0 h-72 w-72 rounded-full bg-violet/35 blur-3xl" />
          <div
            className="hero-glow absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-pink/25 blur-3xl"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
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
            <CtaButton href="/dashboard" ariaLabel="Connect TikTok and start scheduling" icon="play">
              CONNECT TIKTOK — FREE
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
        <section id="what-is-tiktok-scheduler" className="mb-20">
          <h2 className="mb-4 font-display text-2xl font-bold text-white md:text-3xl">
            What is TikTok Scheduler?
          </h2>
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div className="space-y-4 text-lg leading-relaxed text-white/80">
              <p>
                <strong className="font-semibold text-white">{SITE_NAME}</strong> is a web-based
                TikTok post scheduler for creators, brands, and small teams. Instead of posting only
                when you finish editing, you upload videos, write captions, choose publish times, and
                let the queue go live automatically.
              </p>
              <p>
                It solves a simple timing problem: your best creative moments rarely match your
                audience’s peak hours. A dedicated{" "}
                <strong className="font-semibold text-white">TikTok scheduler</strong> turns batch
                filming into a calm content calendar so consistency does not depend on living inside
                the mobile app.
              </p>
              <p>
                You can still use TikTok’s native Studio tools for short windows. {SITE_NAME} is for
                longer planning — weekly calendars, bulk queues, desktop captioning, and peak-time
                slots. Read how that compares in{" "}
                <Link
                  href="/blog/does-tiktok-have-a-scheduler"
                  className="text-violet-soft underline hover:no-underline"
                >
                  does TikTok have a scheduler
                </Link>
                .
              </p>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-brand-soft">
              <Image
                src={BRAND_FEATURE_2}
                alt="What TikTok Scheduler looks like — calendar and queued posts"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Who it is for",
                body: "Solo creators, social managers, and brands that publish TikToks on a weekly rhythm.",
              },
              {
                title: "What you get",
                body: "A queue, visual calendar, captions on desktop, and auto-publish at chosen times.",
              },
              {
                title: "Why it helps",
                body: "You film when energy is high and publish when followers are online — without daily scramble.",
              },
            ].map((item) => (
              <li key={item.title} className="border-t border-violet/40 pt-4">
                <h3 className="mb-2 font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/70">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="features" className="mb-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="mb-3 font-display text-2xl font-bold text-white md:text-3xl">
                TikTok Scheduler features
              </h2>
              <p className="max-w-2xl text-white/80">
                Everything you need to plan, queue, and publish TikTok videos without juggling drafts
                across devices.
              </p>
            </div>
            <Link
              href="/features"
              className="text-sm font-semibold text-violet-soft underline-offset-4 hover:underline"
            >
              Full features page →
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {homeFeatures.map((feature) => (
              <article key={feature.title} className="border-t border-white/10 pt-5">
                <h3 className="mb-2 font-display text-xl font-semibold text-white">{feature.title}</h3>
                <p className="leading-relaxed text-white/75">{feature.body}</p>
              </article>
            ))}
          </div>
          <div className="relative mt-12 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-brand-soft">
            <Image
              src={BRAND_FEATURE_3}
              alt="TikTok Scheduler features — auto-publish queue and timeline"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </section>

        <section id="how-to-use" className="mb-20">
          <h2 className="mb-4 font-display text-2xl font-bold text-white md:text-3xl">
            How to use TikTok Scheduler
          </h2>
          <p className="mb-10 max-w-3xl text-lg leading-relaxed text-white/80">
            From empty calendar to scheduled week in five steps. Prefer a longer walkthrough? See{" "}
            <Link href="/how-it-works" className="text-violet-soft underline hover:no-underline">
              how it works
            </Link>{" "}
            or the guide on{" "}
            <Link
              href="/blog/how-to-schedule-tiktok-posts"
              className="text-violet-soft underline hover:no-underline"
            >
              how to schedule TikTok posts
            </Link>
            .
          </p>
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <ol className="space-y-8">
              {howToUseSteps.map((step, index) => (
                <li key={step.n} className="flex gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet to-pink font-display text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="mb-1 font-display text-xl font-semibold text-white">{step.t}</h3>
                    <p className="leading-relaxed text-white/75">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="space-y-6">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-brand-soft">
                <Image
                  src={BRAND_FEATURE_4}
                  alt="How to use TikTok Scheduler — upload, schedule, and publish"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
              <div className="border border-white/10 bg-white/5 p-6">
                <h3 className="mb-2 font-display text-lg font-semibold text-white">
                  Quick tip for better results
                </h3>
                <p className="leading-relaxed text-white/75">
                  Film in one batch, then schedule posts for the{" "}
                  <Link
                    href="/blog/best-time-to-post-on-tiktok"
                    className="text-violet-soft underline hover:no-underline"
                  >
                    best times to post on TikTok
                  </Link>{" "}
                  for your niche. Keep a simple{" "}
                  <Link
                    href="/blog/tiktok-content-calendar"
                    className="text-violet-soft underline hover:no-underline"
                  >
                    content calendar
                  </Link>{" "}
                  so every peak slot has a video ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="mb-4 font-display text-2xl font-bold text-white md:text-3xl">
            Why creators use a TikTok post scheduler
          </h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-white/80">
            Posting every day is hard when inspiration hits at midnight and your audience wakes at
            7 a.m. Scheduling turns that mismatch into a repeatable system.
          </p>
          <ul className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Post at peak times",
                body: "Lock slots when followers are online, then let auto-publish handle go-live.",
              },
              {
                title: "Batch once, publish all week",
                body: "Film in a single session, upload in bulk, and keep the calendar full without daily stress.",
              },
              {
                title: "Desktop-first workflow",
                body: "Write longer captions, organize hashtags, and preview posts on a full screen.",
              },
            ].map((item) => (
              <li key={item.title} className="border-t border-pink/40 pt-4">
                <h3 className="mb-2 font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="leading-relaxed text-white/75">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-20 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mb-4 font-display text-2xl font-bold text-white md:text-3xl">
              Guides to grow with scheduling
            </h2>
            <p className="mb-6 leading-relaxed text-white/80">
              Pair the product with practical articles people already search for — timing, calendars,
              and native vs tool scheduling.
            </p>
            <ul className="space-y-3">
              {[
                { href: "/features", label: "All product features" },
                { href: "/pricing", label: "Free plan details" },
                { href: "/dashboard", label: "Open dashboard" },
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
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-brand-soft">
            <Image
              src={BRAND_FEATURE_2}
              alt="TikTok scheduling guides and content calendar resources"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
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
          <CtaButton href="/dashboard" ariaLabel="Open free TikTok Scheduler dashboard" icon="arrow">
            OPEN FREE DASHBOARD
          </CtaButton>
        </section>
      </div>
    </>
  );
}
