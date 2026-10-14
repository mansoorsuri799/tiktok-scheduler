import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogPostSchema from "@/components/BlogPostSchema";
import FaqSection from "@/components/FaqSection";
import CtaButton from "@/components/CtaButton";
import { BRAND_FEATURE_4, OG_IMAGE, SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

const SLUG = "does-tiktok-have-a-scheduler";
const TITLE = "Does TikTok Have a Scheduler? Native vs Tools";
const DESCRIPTION =
  "Yes — TikTok offers native Video Scheduler / Studio scheduling. Here’s what it can do, its limits, and when a TikTok scheduler tool is better.";

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
    question: "Does TikTok have a built-in scheduler?",
    answer:
      "Yes. Eligible Professional accounts can schedule uploads through TikTok Studio / Video Scheduler features on supported surfaces.",
  },
  {
    question: "Is the native TikTok scheduler free?",
    answer:
      "Scheduling inside TikTok does not require a separate paid scheduler, though account eligibility and feature availability can vary by region and account type.",
  },
  {
    question: "When should I use a third-party TikTok scheduler?",
    answer:
      "When you need a longer planning horizon, bulk queues, team approvals, or a dedicated content calendar beyond Studio’s short-window scheduling.",
  },
];

export default function DoesTikTokHaveSchedulerPage() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-10">
      <BlogPostSchema
        title={TITLE}
        description={DESCRIPTION}
        slug={SLUG}
        datePublished="2026-10-14"
        image={`${SITE_ORIGIN}${BRAND_FEATURE_4}`}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "Does TikTok Have a Scheduler?" },
        ]}
      />

      <h1 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">{TITLE}</h1>
      <p className="mb-8 text-lg leading-relaxed text-white/80">
        Short answer: <strong className="text-white">yes</strong>. TikTok introduced Video Scheduler
        so Creators and Business accounts can plan uploads in advance. The better question is whether
        native scheduling alone covers how you actually work.
      </p>

      <div className="relative mb-10 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-brand-soft">
        <Image
          src={BRAND_FEATURE_4}
          alt="Comparing native TikTok scheduling with TikTok Scheduler"
          width={1600}
          height={900}
          className="h-full w-full object-contain"
          priority
        />
      </div>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">What native TikTok scheduling covers</h2>
        <p>
          Official announcements and Studio docs describe scheduling individual (and sometimes bulk)
          uploads for a limited window — commonly discussed around a 10-day horizon depending on
          product updates. You set caption and time inside TikTok’s own upload UI.
        </p>
        <p>
          For a few posts per week, native is enough. For a full{" "}
          <Link href="/blog/tiktok-content-calendar" className="text-violet-soft underline hover:no-underline">
            content calendar
          </Link>
          , teams usually outgrow that window.
        </p>
      </section>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">Where native scheduling falls short</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Shorter planning horizon than a monthly creator calendar</li>
          <li>Weaker multi-person approval flows for agencies</li>
          <li>Less convenient bulk planning after a long filming day</li>
          <li>Fewer cross-workflow tools (peak suggestions + calendar in one place)</li>
        </ul>
        <p>
          That gap is why Buffer, Later, SocialBee, Adobe Express, and {SITE_NAME} all rank for
          “TikTok scheduler.”
        </p>
      </section>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">When to use TikTok Scheduler instead</h2>
        <p>Choose a dedicated tool when you:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Batch-produce a week or more of videos at once</li>
          <li>Need desktop captioning and a visual queue</li>
          <li>Want peak-time suggestions tied to{" "}
            <Link href="/blog/best-time-to-post-on-tiktok" className="text-violet-soft underline hover:no-underline">
              best posting times
            </Link>
          </li>
          <li>Share a calendar with an editor or brand manager</li>
        </ul>
        <p>
          Start with our{" "}
          <Link href="/how-it-works" className="text-violet-soft underline hover:no-underline">
            how it works
          </Link>{" "}
          walkthrough or the full{" "}
          <Link href="/blog/how-to-schedule-tiktok-posts" className="text-violet-soft underline hover:no-underline">
            how to schedule TikTok posts
          </Link>{" "}
          guide.
        </p>
      </section>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">Quick comparison</h2>
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-white/5 text-white">
              <tr>
                <th className="px-4 py-3">Need</th>
                <th className="px-4 py-3">Native TikTok</th>
                <th className="px-4 py-3">{SITE_NAME}</th>
              </tr>
            </thead>
            <tbody className="text-white/75">
              <tr className="border-t border-white/10">
                <td className="px-4 py-3">Schedule a few posts</td>
                <td className="px-4 py-3">Excellent</td>
                <td className="px-4 py-3">Excellent</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-4 py-3">Month-ahead calendar</td>
                <td className="px-4 py-3">Limited</td>
                <td className="px-4 py-3">Built for it</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-4 py-3">Bulk queue after filming</td>
                <td className="px-4 py-3">Basic</td>
                <td className="px-4 py-3">Included free</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-4 py-3">Auto-publish queue</td>
                <td className="px-4 py-3">Limited window</td>
                <td className="px-4 py-3">Free dashboard</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <FaqSection items={faqs} />

      <div className="mt-12 border-t border-white/10 pt-10 text-center">
        <CtaButton href="/" ariaLabel="Try TikTok Scheduler">
          TRY TIKTOK SCHEDULER
        </CtaButton>
      </div>
    </article>
  );
}
