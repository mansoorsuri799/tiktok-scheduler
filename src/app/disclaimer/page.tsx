import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CONTACT_EMAIL, SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `Product and content disclaimer for ${SITE_NAME} scheduling guides and software.`,
  alternates: { canonical: `${SITE_ORIGIN}/disclaimer` },
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]} />
      <h1 className="mb-6 font-display text-3xl font-bold text-white">Disclaimer</h1>
      <div className="space-y-5 leading-relaxed text-white/80">
        <p>
          {SITE_NAME} provides software and educational articles about scheduling TikTok posts,
          posting times, and content calendars. Nothing on this site guarantees views, followers,
          revenue, or algorithmic outcomes.
        </p>
        <p>
          TikTok is a trademark of its respective owners. {SITE_NAME} is an independent product and
          is not affiliated with, endorsed by, or sponsored by TikTok or ByteDance unless explicitly
          stated. Platform features, APIs, and account requirements can change without notice.
        </p>
        <p>
          Scheduling depends on account permissions, API availability, and your content complying
          with TikTok’s Community Guidelines. Always review posts before they go live.
        </p>
        <p>
          Questions:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-soft underline hover:no-underline">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="text-sm text-white/55">Last updated: October 14, 2026</p>
      </div>
    </div>
  );
}
