type FaqItem = { question: string; answer: string };

export default function FaqSection({
  id = "faq",
  title = "Frequently asked questions",
  items,
}: {
  id?: string;
  title?: string;
  items: FaqItem[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section id={id} className="mt-16">
      <h2 className="mb-6 font-display text-2xl font-bold text-white md:text-3xl">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-xl border border-white/10 bg-white/5 open:border-violet/50"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-white">
              <span>{item.question}</span>
              <span className="text-xl leading-none text-pink transition group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="px-5 pb-4 leading-relaxed text-white/80">{item.answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}
