import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import { CONTACT_EMAIL, SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Contact TikTok Scheduler",
  description:
    "Contact the TikTok Scheduler team with product questions, feedback, or partnership inquiries.",
  alternates: { canonical: `${SITE_ORIGIN}/contact-us` },
  openGraph: {
    title: "Contact TikTok Scheduler",
    description: "Reach the TikTok Scheduler team by form or email.",
    url: `${SITE_ORIGIN}/contact-us`,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
      <h1 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">Contact us</h1>
      <p className="mb-6 leading-relaxed text-white/80">
        Send product feedback, report a scheduling issue, or ask about partnerships. We typically
        reply within 1–2 business days. For account-security issues, include the email on your {SITE_NAME} account.
      </p>
      <p className="mb-8 text-white/80">
        Email:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-soft underline hover:no-underline">
          {CONTACT_EMAIL}
        </a>
      </p>
      <ContactForm />
    </div>
  );
}
