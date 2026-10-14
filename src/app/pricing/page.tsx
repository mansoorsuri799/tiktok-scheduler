import Image from "next/image";
import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaButton from "@/components/CtaButton";
import FaqSection from "@/components/FaqSection";
import { BRAND_FEATURE_4, OG_IMAGE, SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "TikTok Scheduler Pricing — Free & Growth Plans",
  description:
    "Simple TikTok Scheduler pricing: free plan to start, Growth for bulk scheduling and more queued posts, Team for multi-seat brands.",
  alternates: { canonical: `${SITE_ORIGIN}/pricing` },
  openGraph: {
    title: "TikTok Scheduler Pricing — Free & Growth Plans",
    description: "Choose a plan for scheduling TikTok posts — start free.",
    url: `${SITE_ORIGIN}/pricing`,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "TikTok Scheduler pricing" }],
  },
};

const faqs = [
  {
    question: "Is there a free TikTok scheduler plan?",
    answer:
      "Yes. Free includes core scheduling for a limited number of posts per month so you can validate the workflow before upgrading.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Paid plans are month-to-month. Cancel from billing settings and your queue remains until the period ends.",
  },
  {
    question: "Do you offer team seats?",
    answer:
      "The Team plan adds seats for editors and approvers who share one TikTok publishing calendar.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    blurb: "Learn the queue and publish your first week of content.",
    perks: ["1 TikTok account", "Limited scheduled posts / month", "Content calendar view", "Email support"],
  },
  {
    name: "Growth",
    price: "$19",
    blurb: "For creators who batch film and need reliable auto-publish.",
    perks: ["1 TikTok account", "Higher monthly queue limits", "Bulk upload", "Peak-time suggestions", "Priority email support"],
    featured: true,
  },
  {
    name: "Team",
    price: "$49",
    blurb: "For brands and agencies coordinating approvals.",
    perks: ["Up to 3 TikTok accounts", "3 seats", "Shared calendar", "Bulk upload", "Approval notes"],
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pricing" }]} />
      <h1 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
        Pricing that starts free
      </h1>
      <p className="mb-10 max-w-2xl text-lg text-white/80">
        Pick a plan for how often you publish — not a maze of add-ons. All plans run on{" "}
        {SITE_NAME} at tiktokscheduler.net.
      </p>

      <div className="relative mb-12 aspect-[21/9] overflow-hidden rounded-2xl border border-white/10">
        <Image
          src={BRAND_FEATURE_4}
          alt="TikTok Scheduler plans for creators and teams"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 960px"
          className="object-cover"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col border p-6 ${
              plan.featured
                ? "border-violet bg-violet/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <h2 className="font-display text-xl font-bold text-white">{plan.name}</h2>
            <p className="mt-3 font-display text-3xl font-bold text-white">
              {plan.price}
              <span className="text-base font-medium text-white/60">/mo</span>
            </p>
            <p className="mt-3 text-sm text-white/75">{plan.blurb}</p>
            <ul className="mt-6 flex-1 space-y-2 text-sm text-white/80">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex gap-2">
                  <span className="text-teal" aria-hidden="true">✓</span>
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <CtaButton
                href="/#start"
                className="w-full !px-4 !py-3 !text-base"
                ariaLabel={`Choose ${plan.name} plan`}
              >
                {plan.name === "Free" ? "START FREE" : "CHOOSE PLAN"}
              </CtaButton>
            </div>
          </div>
        ))}
      </div>

      <FaqSection items={faqs} />
    </div>
  );
}
