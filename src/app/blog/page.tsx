import Link from "next/link";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "TikTok Scheduler Blog — Timing, Calendars & How-Tos",
  description:
    "SERP-backed TikTok scheduling guides: how to schedule posts, best times to post, content calendars, and native vs tool schedulers.",
  alternates: { canonical: `${SITE_ORIGIN}/blog` },
  openGraph: {
    title: "TikTok Scheduler Blog — Timing, Calendars & How-Tos",
    description: "Practical TikTok scheduling articles from TikTok Scheduler.",
    url: `${SITE_ORIGIN}/blog`,
    siteName: SITE_NAME,
    type: "website",
  },
};

const posts = [
  {
    href: "/blog/how-to-schedule-tiktok-posts",
    title: "How to Schedule TikTok Posts (Mobile, Desktop & Tools)",
    excerpt:
      "Step-by-step ways to schedule TikTok videos — native Studio options and a dedicated TikTok scheduler workflow.",
    date: "October 2026",
    read: "11 min read",
  },
  {
    href: "/blog/best-time-to-post-on-tiktok",
    title: "Best Time to Post on TikTok in 2026",
    excerpt:
      "Peak windows by weekday, how to read your own analytics, and how scheduling locks those times in.",
    date: "October 2026",
    read: "10 min read",
  },
  {
    href: "/blog/tiktok-content-calendar",
    title: "TikTok Content Calendar: Plan a Week That Actually Ships",
    excerpt:
      "Build a simple TikTok content calendar, batch film, and schedule posts so consistency sticks.",
    date: "October 2026",
    read: "9 min read",
  },
  {
    href: "/blog/does-tiktok-have-a-scheduler",
    title: "Does TikTok Have a Scheduler? Native vs Tools",
    excerpt:
      "What TikTok’s Video Scheduler and Studio can do — and when a third-party TikTok scheduler is worth it.",
    date: "October 2026",
    read: "8 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <h1 className="mb-3 font-display text-3xl font-bold text-white md:text-4xl">
        TikTok scheduling blog
      </h1>
      <p className="mb-10 text-lg text-white/80">
        Only topics people actively search alongside a TikTok scheduler — how-tos, timing, calendars,
        and native scheduling limits. No filler posts.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.href}
            className="border border-white/10 bg-white/5 p-6 transition-colors hover:border-violet/50"
          >
            <h2 className="mb-3 font-display text-xl font-bold text-white">{post.title}</h2>
            <p className="mb-4 text-white/75">{post.excerpt}</p>
            <div className="mb-4 flex items-center gap-2 text-sm text-white/55">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.read}</span>
            </div>
            <Link href={post.href} className="font-semibold text-violet-soft hover:underline">
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
