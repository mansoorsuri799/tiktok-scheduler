import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaButton from "@/components/CtaButton";
import FaqSection from "@/components/FaqSection";
import { BRAND_FEATURE_3, OG_IMAGE, SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "How TikTok Scheduler Works — Connect, Queue, Publish",
  description:
    "Learn how TikTok Scheduler works: connect your Professional account, upload videos, pick peak times, and auto-publish on schedule.",
  alternates: { canonical: `${SITE_ORIGIN}/how-it-works` },
  openGraph: {
    title: "How TikTok Scheduler Works — Connect, Queue, Publish",
    description: "A clear walkthrough of scheduling TikTok posts with TikTok Scheduler.",
    url: `${SITE_ORIGIN}/how-it-works`,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "How TikTok Scheduler works" }],
  },
};

const faqs = [
  {
    question: "How long does setup take?",
    answer:
      "Most creators connect TikTok and schedule a first test post in under ten minutes once they have a video file ready.",
  },
  {
    question: "What if my TikTok account disconnects?",
    answer:
      "Re-authorize from account settings. Queued posts pause safely until the connection is restored so you do not lose drafts.",
  },
  {
    question: "Where can I learn native TikTok Studio scheduling too?",
    answer:
      "See our guide on whether TikTok has a built-in scheduler, plus the step-by-step how to schedule TikTok posts article for mobile and desktop options.",
  },
];

const steps = [
  {
    title: "Create your TikTok Scheduler account",
    body: "Sign up on tiktokscheduler.net with your work email. The free plan is enough to learn the queue and publish a starter calendar.",
  },
  {
    title: "Connect a Professional TikTok account",
    body: "Authorize Creator or Business access so publishing permissions are available. Personal accounts may need to switch to a Professional profile first.",
  },
  {
    title: "Upload videos and write captions",
    body: "Add MP4 clips, choose covers, and write captions on desktop. Save hashtag sets you reuse for series or product launches.",
  },
  {
    title: "Choose dates and peak times",
    body: "Pick exact timestamps or start from suggested windows. Align launches with the best time to post on TikTok for your niche.",
  },
  {
    title: "Approve and auto-publish",
    body: "Review the queue, approve posts, and let TikTok Scheduler publish when each slot arrives. Edit or reschedule anytime before go-live.",
  },
];

export default function HowItWorksPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to use TikTok Scheduler",
    description: "Connect TikTok, upload videos, schedule times, and auto-publish.",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "How It Works" }]} />
      <h1 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
        How {SITE_NAME} works
      </h1>
      <p className="mb-10 text-lg leading-relaxed text-white/80">
        From empty calendar to scheduled week — without living inside the TikTok app. Prefer a
        longer tutorial? Read{" "}
        <Link href="/blog/how-to-schedule-tiktok-posts" className="text-violet-soft underline hover:no-underline">
          how to schedule TikTok posts
        </Link>
        .
      </p>

      <div className="relative mb-12 aspect-video overflow-hidden rounded-2xl border border-white/10">
        <Image
          src={BRAND_FEATURE_3}
          alt="Step-by-step TikTok Scheduler workflow from upload to publish"
          fill
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
        />
      </div>

      <ol className="space-y-10">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-5">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet to-pink font-display text-sm font-bold text-white">
              {index + 1}
            </span>
            <div>
              <h2 className="mb-2 font-display text-xl font-semibold text-white">{step.title}</h2>
              <p className="leading-relaxed text-white/75">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <FaqSection items={faqs} />

      <div className="mt-14 text-center">
        <CtaButton href="/#start" ariaLabel="Start using TikTok Scheduler">
          START NOW
        </CtaButton>
      </div>
    </div>
  );
}
