import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogPostSchema from "@/components/BlogPostSchema";
import FaqSection from "@/components/FaqSection";
import CtaButton from "@/components/CtaButton";
import { BRAND_HERO, OG_IMAGE, SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

const SLUG = "how-to-schedule-tiktok-posts";
const TITLE = "How to Schedule TikTok Posts (Mobile, Desktop & Tools)";
const DESCRIPTION =
  "Learn how to schedule TikTok posts on mobile and desktop with TikTok Studio, plus a dedicated TikTok scheduler for longer queues and auto-publish.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_ORIGIN}/blog/${SLUG}` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_ORIGIN}/blog/${SLUG}`,
    siteName: SITE_NAME,
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: TITLE }],
  },
};

const faqs = [
  {
    question: "Can you schedule TikTok posts for free?",
    answer:
      "Yes. TikTok’s native scheduler is free for eligible Professional accounts within its limits. TikTok Scheduler also offers a free plan to queue posts and learn the workflow.",
  },
  {
    question: "Can I schedule TikTok from a computer?",
    answer:
      "Yes. Use TikTok Studio / tiktok.com upload on desktop, or a web TikTok scheduler like TikTok Scheduler for a fuller calendar and bulk queue.",
  },
  {
    question: "How far in advance can I schedule?",
    answer:
      "Native TikTok scheduling windows are shorter (often measured in days). A third-party TikTok scheduler is built for planning further ahead with a content calendar.",
  },
  {
    question: "Do I need a Business account to schedule?",
    answer:
      "You typically need a Professional account (Creator or Business) with publishing permissions. Personal accounts usually must switch first.",
  },
];

export default function HowToSchedulePage() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-10">
      <BlogPostSchema
        title={TITLE}
        description={DESCRIPTION}
        slug={SLUG}
        datePublished="2026-10-14"
        image={`${SITE_ORIGIN}${BRAND_HERO}`}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "How to Schedule TikTok Posts" },
        ]}
      />

      <h1 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">{TITLE}</h1>
      <p className="mb-8 text-lg leading-relaxed text-white/80">
        Creators search “how to schedule TikTok posts” because consistency beats random posting.
        This guide covers native options and a cleaner desktop workflow with{" "}
        <Link href="/" className="text-violet-soft underline hover:no-underline">
          TikTok Scheduler
        </Link>
        .
      </p>

      <div className="relative mb-10 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-brand-soft">
        <Image
          src={BRAND_HERO}
          alt="Scheduling TikTok posts on a desktop calendar queue"
          width={1600}
          height={900}
          className="h-full w-full object-contain"
          priority
        />
      </div>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">Why schedule TikTok videos at all?</h2>
        <p>
          Peak attention rarely lines up with when you finish editing. Scheduling lets you film in
          batches, then publish when your audience is online. That is the same reason tools like
          Buffer, Later, and Adobe Express rank for “TikTok scheduler” — and why a focused calendar
          still matters in 2026.
        </p>
        <p>
          If you also care about timing strategy, pair this walkthrough with our{" "}
          <Link href="/blog/best-time-to-post-on-tiktok" className="text-violet-soft underline hover:no-underline">
            best time to post on TikTok
          </Link>{" "}
          guide.
        </p>
      </section>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">Option 1: Schedule inside TikTok Studio</h2>
        <p>
          TikTok’s own Video Scheduler / Studio upload flow is the official path. Switch to a
          Professional account, open Studio on desktop (or the in-app upload flow where available),
          upload your video, add caption and cover, then choose a future publish time instead of
          posting immediately.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Open TikTok Studio or the web upload page while signed into a Professional account.</li>
          <li>Upload the video file and set caption, hashtags, and cover.</li>
          <li>Select schedule (not post now) and confirm the date and time in your local timezone.</li>
          <li>Review drafts/scheduled posts later if you need to cancel or adjust.</li>
        </ol>
        <p>
          Native scheduling is ideal for a few posts. Limits on horizon and batch planning are why
          many teams still ask{" "}
          <Link href="/blog/does-tiktok-have-a-scheduler" className="text-violet-soft underline hover:no-underline">
            does TikTok have a scheduler
          </Link>{" "}
          that covers a full month.
        </p>
      </section>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">Option 2: Schedule with TikTok Scheduler</h2>
        <p>
          Use {SITE_NAME} when you want a content calendar, bulk upload, and auto-publish without
          babysitting Studio notifications. The product flow matches how people actually work after
          a filming day.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Create an account on{" "}
            <Link href="/" className="text-violet-soft underline hover:no-underline">
              tiktokscheduler.net
            </Link>{" "}
            and connect your Professional TikTok profile.
          </li>
          <li>Upload one video or a batch; add captions and hashtags on desktop.</li>
          <li>Assign publish times — exact slots or suggested peak windows.</li>
          <li>Approve the queue and let auto-publish handle go-live.</li>
        </ol>
        <p>
          See the visual walkthrough on our{" "}
          <Link href="/how-it-works" className="text-violet-soft underline hover:no-underline">
            how it works
          </Link>{" "}
          page and the full{" "}
          <Link href="/features" className="text-violet-soft underline hover:no-underline">
            features
          </Link>{" "}
          list.
        </p>
      </section>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">Mobile vs desktop scheduling</h2>
        <p>
          Mobile is best for filming and quick native posts. Desktop wins for longer captions, bulk
          files, and calendar views. Many creators film on phone, then schedule on computer — the
          workflow {SITE_NAME} is built around.
        </p>
      </section>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">Tips that improve scheduled posts</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Write captions before you queue so every slot is publish-ready.</li>
          <li>Keep a simple{" "}
            <Link href="/blog/tiktok-content-calendar" className="text-violet-soft underline hover:no-underline">
              TikTok content calendar
            </Link>{" "}
            so themes do not collide.
          </li>
          <li>Schedule a buffer post for days you cannot film.</li>
          <li>Re-check account connection weekly so queued videos do not stall.</li>
        </ul>
      </section>

      <FaqSection items={faqs} />

      <div className="mt-12 border-t border-white/10 pt-10 text-center">
        <p className="mb-6 text-white/80">Ready to queue your next week of TikToks?</p>
        <CtaButton href="/dashboard" ariaLabel="Connect TikTok and start scheduling">
          CONNECT TIKTOK — FREE
        </CtaButton>
      </div>
    </article>
  );
}
