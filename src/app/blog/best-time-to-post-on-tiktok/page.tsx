import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogPostSchema from "@/components/BlogPostSchema";
import FaqSection from "@/components/FaqSection";
import CtaButton from "@/components/CtaButton";
import { BRAND_FEATURE_2, OG_IMAGE, SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

const SLUG = "best-time-to-post-on-tiktok";
const TITLE = "Best Time to Post on TikTok in 2026";
const DESCRIPTION =
  "Find the best time to post on TikTok in 2026 — weekday windows, niche caveats, and how to lock peak slots with a TikTok scheduler.";

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
    question: "What is the best time to post on TikTok generally?",
    answer:
      "Many 2026 studies cluster around early mornings, lunch, and early evenings on weekdays — but your analytics beat any global average.",
  },
  {
    question: "Does the best time change by niche?",
    answer:
      "Yes. B2B and education often peak earlier; entertainment and lifestyle can run later. Always validate with your follower activity chart.",
  },
  {
    question: "How do I post at the best time if I am busy then?",
    answer:
      "Schedule ahead. Queue videos in TikTok Scheduler so they publish during peak windows even when you are offline.",
  },
];

const windows = [
  { day: "Monday", slots: "7–9 a.m., 12–1 p.m., 7–9 p.m." },
  { day: "Tuesday", slots: "8–10 a.m., 12–2 p.m., 6–8 p.m." },
  { day: "Wednesday", slots: "7–9 a.m., 11 a.m.–1 p.m., 7–9 p.m." },
  { day: "Thursday", slots: "8–10 a.m., 12–2 p.m., 6–9 p.m." },
  { day: "Friday", slots: "7–9 a.m., 12–1 p.m., 5–7 p.m." },
  { day: "Saturday", slots: "9–11 a.m., 12–2 p.m." },
  { day: "Sunday", slots: "9–11 a.m., 7–9 p.m." },
];

export default function BestTimePage() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-10">
      <BlogPostSchema
        title={TITLE}
        description={DESCRIPTION}
        slug={SLUG}
        datePublished="2026-10-14"
        image={`${SITE_ORIGIN}${BRAND_FEATURE_2}`}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "Best Time to Post on TikTok" },
        ]}
      />

      <h1 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">{TITLE}</h1>
      <p className="mb-8 text-lg leading-relaxed text-white/80">
        “Best time to post on TikTok” ranks because timing still multiplies good creative. Use
        research windows as a starting line, then let your analytics — and a{" "}
        <Link href="/" className="text-violet-soft underline hover:no-underline">
          TikTok scheduler
        </Link>{" "}
        — lock the winners.
      </p>

      <div className="relative mb-10 aspect-video overflow-hidden rounded-2xl border border-white/10">
        <Image
          src={BRAND_FEATURE_2}
          alt="Peak posting windows visualized on a TikTok content calendar"
          width={1600}
          height={900}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">2026 starting windows (not gospel)</h2>
        <p>
          Aggregated studies from large social platforms repeatedly highlight weekday mornings,
          midday scrolls, and early evenings. Weekends lean later morning. Treat the table below as
          a draft calendar — then overwrite it with your own follower activity.
        </p>
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="bg-white/5 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Day</th>
                <th className="px-4 py-3 font-semibold">Common strong slots (local time)</th>
              </tr>
            </thead>
            <tbody>
              {windows.map((row) => (
                <tr key={row.day} className="border-t border-white/10">
                  <td className="px-4 py-3 font-medium text-white">{row.day}</td>
                  <td className="px-4 py-3 text-white/75">{row.slots}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">Find YOUR best time in analytics</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Open TikTok Analytics → Followers (or Overview) and note hours with the highest activity.</li>
          <li>Post similar creative at two candidate times for two weeks.</li>
          <li>Compare average views in the first hour — not only total lifetime views.</li>
          <li>Lock winning slots into your scheduler so the experiment becomes habit.</li>
        </ol>
      </section>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">Use a scheduler to hit those slots</h2>
        <p>
          Knowing the best time is useless if you are offline when it arrives. Queue posts in{" "}
          {SITE_NAME}, assign peak windows, and auto-publish. Combine with{" "}
          <Link href="/blog/how-to-schedule-tiktok-posts" className="text-violet-soft underline hover:no-underline">
            how to schedule TikTok posts
          </Link>{" "}
          and a{" "}
          <Link href="/blog/tiktok-content-calendar" className="text-violet-soft underline hover:no-underline">
            content calendar
          </Link>{" "}
          so every strong slot has a video ready.
        </p>
      </section>

      <section className="mb-10 space-y-4 leading-relaxed text-white/80">
        <h2 className="font-display text-2xl font-bold text-white">Mistakes that waste good timing</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Copying a competitor’s timezone when your audience lives elsewhere.</li>
          <li>Changing creative and time at once — you will not know which moved the needle.</li>
          <li>Posting five times in one hour, then going dark for days.</li>
        </ul>
      </section>

      <FaqSection items={faqs} />

      <div className="mt-12 border-t border-white/10 pt-10 text-center">
        <CtaButton href="/features" ariaLabel="See peak-time scheduling features">
          SEE SCHEDULING FEATURES
        </CtaButton>
      </div>
    </article>
  );
}
