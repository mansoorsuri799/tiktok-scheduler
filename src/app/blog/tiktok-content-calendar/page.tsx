import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogPostSchema from "@/components/BlogPostSchema";
import FaqSection from "@/components/FaqSection";
import CtaButton from "@/components/CtaButton";
import { BRAND_FEATURE_3, OG_IMAGE, SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

const SLUG = "tiktok-content-calendar";
const TITLE = "TikTok Content Calendar: Plan a Week That Actually Ships";
const DESCRIPTION =
  "Build a TikTok content calendar that you can keep — themes, batch filming, and scheduling posts so your week publishes on time.";

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
    question: "How many TikToks should a weekly calendar include?",
    answer:
      "Most growing accounts aim for 4–7 posts per week. Start with a number you can film in one batch session, then scale.",
  },
  {
    question: "Do I need a fancy template?",
    answer:
      "No. A simple grid of day, hook, format, and status is enough. The calendar inside TikTok Scheduler replaces scattered sheets once you are ready to publish.",
  },
  {
    question: "How far ahead should I plan?",
    answer:
      "One to two weeks keeps trends fresh while still reducing daily decision fatigue. Leave a few open slots for reactive content.",
  },
];

export default function ContentCalendarPage() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-10">
      <BlogPostSchema
        title={TITLE}
        description={DESCRIPTION}
        slug={SLUG}
        datePublished="2026-10-14"
        image={`${SITE_ORIGIN}${BRAND_FEATURE_3}`}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "TikTok Content Calendar" },
        ]}
      />

      <h1 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">{TITLE}</h1>
      <p className="mb-8 text-lg leading-relaxed text-white/80">
        Searches for “TikTok content calendar” spike because creators want a plan that survives busy
        weeks. A calendar only works when it connects to{" "}
        <Link href="/blog/how-to-schedule-tiktok-posts" className="text-violet-soft underline hover:no-underline">
          scheduled publishing
        </Link>
        — not another abandoned Notion page.
      </p>

      <div className="relative mb-10 aspect-video overflow-hidden rounded-2xl border border-white/10">
        <Image
          src={BRAND_FEATURE_3}
          alt="TikTok content calendar with scheduled posts across the week"
          width={1600}
          height={900}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">What belongs on a TikTok content calendar</h2>
        <p>Keep each row lightweight:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Publish day and time (or “TBD — analytics slot”)</li>
          <li>Hook / first-line idea</li>
          <li>Format (talking head, screen record, POV, duet-ready)</li>
          <li>CTA (follow, comment prompt, link in bio)</li>
          <li>Status (idea → filmed → edited → scheduled)</li>
        </ul>
      </section>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">A simple weekly theme mix</h2>
        <p>
          Rotate formats so the algorithm and your audience see variety without a new strategy every
          morning:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>2 educational / how-to posts</li>
          <li>2 personality or behind-the-scenes posts</li>
          <li>1 trend or sound-led post</li>
          <li>1 proof / results / social proof post</li>
        </ul>
        <p>
          Align publish times with the{" "}
          <Link href="/blog/best-time-to-post-on-tiktok" className="text-violet-soft underline hover:no-underline">
            best time to post on TikTok
          </Link>{" "}
          for your niche.
        </p>
      </section>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">Batch day → schedule day</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Monday planning: fill hooks for the week.</li>
          <li>One filming block: capture all talking-head and B-roll.</li>
          <li>Edit in a single sitting; export numbered files.</li>
          <li>
            Upload into{" "}
            <Link href="/" className="text-violet-soft underline hover:no-underline">
              {SITE_NAME}
            </Link>{" "}
            and assign calendar slots.
          </li>
          <li>Leave one flexible slot for reactive trends.</li>
        </ol>
      </section>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">From spreadsheet to live queue</h2>
        <p>
          Spreadsheets help brainstorm. Publishing needs a queue. Move approved rows into the{" "}
          <Link href="/features" className="text-violet-soft underline hover:no-underline">
            TikTok Scheduler calendar
          </Link>{" "}
          so dates become auto-publish events — the gap most template-only blogs leave open.
        </p>
      </section>

      <FaqSection items={faqs} />

      <div className="mt-12 border-t border-white/10 pt-10 text-center">
        <CtaButton href="/pricing" ariaLabel="Open TikTok Scheduler calendar plans">
          OPEN YOUR CALENDAR
        </CtaButton>
      </div>
    </article>
  );
}
