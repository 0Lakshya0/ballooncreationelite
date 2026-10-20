import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/balloon/site-header";
import { SiteLiquidBackground } from "@/components/balloon/site-liquid-background";
import { getService } from "@/lib/service-details";
import { CreationDetailPage } from "@/components/balloon/creations/CreationDetailPage";

const SITE_URL = "https://ballooncreationelite.lovable.app";

export const Route = createFileRoute("/creations/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const service = loaderData;
    const url = `${SITE_URL}/creations/${service.slug}`;
    const description = service.promise.slice(0, 156);

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${service.name} — Balloon Creation`,
      serviceType: service.name,
      description: service.promise,
      url,
      provider: {
        "@type": "LocalBusiness",
        name: "Balloon Creation",
        telephone: "+91-74898-63753",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Indore",
          addressRegion: "Madhya Pradesh",
          addressCountry: "IN",
        },
      },
      areaServed: { "@type": "City", name: "Indore" },
      offers: service.packages.map((pack) => ({
        "@type": "Offer",
        name: pack.name,
        description: pack.bestFor,
        availability: "https://schema.org/InStock",
        url,
      })),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Creations", item: `${SITE_URL}/#portfolio` },
        { "@type": "ListItem", position: 3, name: service.name, item: url },
      ],
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    };

    return {
      meta: [
        { title: `${service.name} in Indore — Balloon Creation` },
        { name: "description", content: description },
        { property: "og:title", content: `${service.name} — Balloon Creation, Indore` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: `${SITE_URL}/og-cover.jpg` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) },
      ],
    };
  },
  component: ServicePage,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  return (
    <div className="site-liquid-shell">
      <SiteLiquidBackground />
      <SiteHeader />
      <main id="main" className="service-missing page-width">
        <span className="eyebrow">A LITTLE LOST</span>
        <h1>That creation has moved.</h1>
        <p>Explore our signature collections — the one you are looking for is still here.</p>
        <Link to="/" hash="portfolio" className="service-back">
          <ArrowLeft size={15} /> Back to all creations
        </Link>
      </main>
    </div>
  );
}

function ServicePage() {
  const service = Route.useLoaderData();
  return <CreationDetailPage key={service.slug} service={service} />;
}
