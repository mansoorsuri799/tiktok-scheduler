import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CONTACT_EMAIL, SITE_DOMAIN, SITE_NAME, SITE_ORIGIN } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME} at ${SITE_DOMAIN}.`,
  alternates: { canonical: `${SITE_ORIGIN}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <h1 className="mb-6 font-display text-3xl font-bold text-white">Privacy Policy</h1>
      <div className="space-y-5 leading-relaxed text-white/80">
        <p>
          {SITE_NAME} ({SITE_DOMAIN}) respects your privacy. This policy explains what information we
          collect and how we use it when you visit our website or use the TikTok scheduling product.
        </p>
        <h2 className="text-xl font-semibold text-white">Information we collect</h2>
        <p>
          When you connect TikTok, we store OAuth access/refresh tokens and basic profile details
          (such as display name and avatar) needed to schedule and publish on your behalf. Tokens stay
          on our server and are not exposed to the browser. If you email us or submit the contact form,
          we receive the details you choose to send.
        </p>
        <h2 className="text-xl font-semibold text-white">Analytics and cookies</h2>
        <p>
          We may use privacy-conscious analytics or similar technologies to understand aggregate
          traffic, popular pages, and performance. You can block cookies in your browser settings.
        </p>
        <h2 className="text-xl font-semibold text-white">How we use information</h2>
        <p>
          We use data to operate scheduling, respond to support requests, improve the product, and
          meet legal obligations. We do not sell personal information.
        </p>
        <h2 className="text-xl font-semibold text-white">Third parties</h2>
        <p>
          Hosting, email, analytics, and TikTok platform APIs may process limited data required to
          run the service. Those providers have their own privacy terms.
        </p>
        <h2 className="text-xl font-semibold text-white">Contact</h2>
        <p>
          Privacy questions:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-soft underline hover:no-underline">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="text-sm text-white/55">Last updated: October 14, 2026</p>
      </div>
    </div>
  );
}
