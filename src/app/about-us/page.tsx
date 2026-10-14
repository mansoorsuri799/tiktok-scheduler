import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaButton from "@/components/CtaButton";
import { BRAND_LOGO, CONTACT_EMAIL, SITE_DOMAIN, SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "About TikTok Scheduler",
  description:
    "About TikTok Scheduler on tiktokscheduler.net — a focused tool and SERP-backed guides for planning and publishing TikTok videos.",
  alternates: { canonical: `${SITE_ORIGIN}/about-us` },
  openGraph: {
    title: "About TikTok Scheduler",
    description: `Independent TikTok scheduling product and guides on ${SITE_DOMAIN}.`,
    url: `${SITE_ORIGIN}/about-us`,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
      <div className="mb-10 flex flex-col items-start gap-8 md:flex-row">
        <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-brand-soft">
          <Image
            src={BRAND_LOGO}
            alt="TikTok Scheduler logo"
            fill
            sizes="160px"
            className="object-contain p-3"
            priority
          />
        </div>
        <div>
          <h1 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
            About {SITE_NAME}
          </h1>
          <p className="mb-4 leading-relaxed text-white/80">
            {SITE_NAME} is an independent product at {SITE_DOMAIN}. We help creators and brands plan
            TikTok videos, fill a content calendar, and auto-publish at times when audiences are
            actually online.
          </p>
          <p className="leading-relaxed text-white/80">
            Alongside the product we publish only high-intent guides — how to schedule posts, best
            times, content calendars, and how native TikTok scheduling compares to dedicated tools.
          </p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 font-display text-2xl font-bold text-white">What we publish</h2>
        <ul className="space-y-3 text-white/80">
          <li className="border border-white/10 bg-white/5 p-4">
            A TikTok scheduler with queue, calendar, and auto-publish
          </li>
          <li className="border border-white/10 bg-white/5 p-4">
            Features, how-it-works, and pricing pages for product intent
          </li>
          <li className="border border-white/10 bg-white/5 p-4">
            SERP-backed articles chosen from live search demand — not filler blogs
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-display text-2xl font-bold text-white">Contact</h2>
        <p className="mb-4 leading-relaxed text-white/80">
          Questions or partnerships:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-soft underline hover:no-underline">
            {CONTACT_EMAIL}
          </a>{" "}
          or our{" "}
          <Link href="/contact-us" className="text-violet-soft underline hover:no-underline">
            contact page
          </Link>
          .
        </p>
        <CtaButton href="/#start" ariaLabel="Start using TikTok Scheduler">
          START SCHEDULING
        </CtaButton>
      </section>
    </div>
  );
}
