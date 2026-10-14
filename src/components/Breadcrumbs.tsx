import Link from "next/link";
import { SITE_ORIGIN } from "@/lib/siteConfig";

export type Crumb = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const itemUrl = item.href
        ? item.href === "/"
          ? `${SITE_ORIGIN}/`
          : `${SITE_ORIGIN}${item.href}`
        : undefined;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        ...(itemUrl ? { item: itemUrl } : {}),
      };
    }),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-white/60">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {index > 0 ? <span className="text-violet/70" aria-hidden="true">/</span> : null}
                {isLast || !item.href ? (
                  <span className="font-semibold text-white" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="text-violet-soft underline hover:no-underline">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
