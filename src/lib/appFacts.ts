import { imageObjectLicensing, SITE_ORIGIN } from "@/lib/schemaImageLicensing";
import {
  BRAND_LOGO,
  CONTACT_EMAIL,
  SITE_NAME,
  SITE_RATING,
  SITE_TAGLINE,
} from "@/lib/siteConfig";

export const APP_AGGREGATE_RATING = {
  "@type": "AggregateRating",
  ratingValue: SITE_RATING.ratingValue,
  ratingCount: SITE_RATING.ratingCount,
  bestRating: SITE_RATING.bestRating,
  worstRating: SITE_RATING.worstRating,
} as const;

export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}${BRAND_LOGO}`,
  email: CONTACT_EMAIL,
  description: SITE_TAGLINE,
  sameAs: [] as string[],
};

export const WEB_APPLICATION_JSON_LD = {
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  url: SITE_ORIGIN,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: APP_AGGREGATE_RATING,
  image: {
    "@type": "ImageObject",
    url: `${SITE_ORIGIN}${BRAND_LOGO}`,
    width: 512,
    height: 512,
    ...imageObjectLicensing,
  },
};
