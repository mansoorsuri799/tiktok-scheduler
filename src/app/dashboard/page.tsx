import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import DashboardApp from "@/components/DashboardApp";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Dashboard — Connect TikTok & Schedule Posts",
  description:
    "Connect your TikTok account and schedule posts on the free TikTok Scheduler plan.",
  alternates: { canonical: `${SITE_ORIGIN}/dashboard` },
  robots: { index: false, follow: false },
  openGraph: {
    title: "TikTok Scheduler Dashboard",
    description: "Connect TikTok and queue posts for free.",
    url: `${SITE_ORIGIN}/dashboard`,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />
      <h1 className="mb-3 font-display text-3xl font-bold text-white md:text-4xl">
        Scheduler dashboard
      </h1>
      <p className="mb-8 text-lg text-white/80">
        Free plan: connect TikTok, queue videos, and auto-publish when the time hits.
      </p>
      <DashboardApp />
    </div>
  );
}
