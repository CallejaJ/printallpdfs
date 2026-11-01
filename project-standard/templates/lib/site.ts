// Public URL of the site. Override with NEXT_PUBLIC_SITE_URL when a custom domain is used.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://project-name.vercel.app").replace(/\/$/, "");

export const SITE_NAME = "ProjectName";
// Brand split for the header: the second part is painted in --accent (e.g. "PrintAll" + "PDFs").
export const BRAND = { lead: "Project", accent: "Name" };
export const VERSION = "0.1.0";
export const AUTHOR = { name: "Jorge Calleja", url: "https://jorgecalleja.dev" };

// Geographic focus for local and generative search (Málaga, Andalucía, Spain).
export const GEO = {
  region: "ES-AN",
  placename: "Málaga",
  latitude: 36.7213,
  longitude: -4.4214,
};
