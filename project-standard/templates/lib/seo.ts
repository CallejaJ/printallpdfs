import { AUTHOR, GEO, SITE_NAME, SITE_URL, VERSION } from "./site";

export const SEO_TITLE = `${SITE_NAME}: what it does in a few words`;
export const SEO_DESCRIPTION =
  "140 to 160 characters: what the app does, for whom, and the key constraint (free, private, local).";

export const BREADCRUMBS = [
  { name: AUTHOR.name, url: AUTHOR.url },
  { name: SITE_NAME, url: `${SITE_URL}/` },
];

/** Schema.org graph for search engines and generative answer engines. Describe only visible content. */
export function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: SEO_DESCRIPTION,
        inLanguage: ["en", "es"],
        publisher: { "@id": `${SITE_URL}/#author` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#author`,
        name: AUTHOR.name,
        url: AUTHOR.url,
        jobTitle: "Diseño Web Málaga",
        address: { "@type": "PostalAddress", addressLocality: GEO.placename, addressRegion: "Andalucía", addressCountry: "ES" },
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: SEO_DESCRIPTION,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any modern web browser",
        inLanguage: ["en", "es"],
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        softwareVersion: `${VERSION}-beta`,
        author: { "@id": `${SITE_URL}/#author` },
        areaServed: { "@type": "Country", name: "Spain" },
        featureList: ["Feature one", "Feature two"],
        screenshot: `${SITE_URL}/og.png`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/#breadcrumbs`,
        itemListElement: BREADCRUMBS.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.name, item: b.url })),
      },
      // Add HowTo and FAQPage nodes when the page shows steps or a help section (see docs/seo-geo.md).
    ],
  };
}
