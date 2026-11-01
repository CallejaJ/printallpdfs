/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export: the app runs entirely in the browser, so it can be served
  // from any static host (Vercel, a local folder, an intranet server).
  output: "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;
