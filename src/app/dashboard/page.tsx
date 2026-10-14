import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import DashboardApp from "@/components/DashboardApp";
import { OG_IMAGE, SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Dashboard — Connect TikTok & Schedule Posts Free",
  description:
    "Free TikTok Scheduler dashboard: connect your TikTok account, queue videos with public URLs, and auto-publish at the times you choose.",
  alternates: { canonical: `${SITE_ORIGIN}/dashboard` },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "TikTok Scheduler Dashboard — Connect & Schedule Free",
    description: "Connect TikTok and queue posts on the free plan.",
    url: `${SITE_ORIGIN}/dashboard`,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "TikTok Scheduler dashboard",
      },
    ],
  },
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />
      <h1 className="mb-3 font-display text-3xl font-bold text-white md:text-4xl">
        TikTok Scheduler dashboard
      </h1>
      <p className="mb-6 text-lg text-white/80">
        Free plan: connect your TikTok account, queue videos, and auto-publish when the time hits.
        No paid upgrade required.
      </p>

      {/* Crawlable intro so Google sees content before the client app loads */}
      <section className="mb-8 space-y-3 text-white/75">
        <h2 className="font-display text-xl font-semibold text-white">
          What you can do here
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Connect a Professional TikTok account with Login Kit OAuth</li>
          <li>Schedule posts with a caption, public https video URL, and publish time</li>
          <li>Auto-publish due posts through TikTok’s Content Posting API</li>
          <li>Disconnect your account anytime from this page</li>
        </ul>
        <p>
          New here? Read{" "}
          <Link href="/how-it-works" className="text-violet-soft underline hover:no-underline">
            how it works
          </Link>{" "}
          or the{" "}
          <Link href="/pricing" className="text-violet-soft underline hover:no-underline">
            free plan
          </Link>{" "}
          details.
        </p>
      </section>

      <DashboardApp />
    </div>
  );
}
