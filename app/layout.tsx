import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MotionProvider from "@/components/MotionProvider";

export const metadata: Metadata = {
  title: "PrintAllPDFs",
  description:
    "Merge many PDFs in your browser and print them all through a single print dialog. Files never leave your computer.",
  icons: {
    icon: "/images/favicon.svg",
    shortcut: "/images/favicon.svg",
    apple: "/images/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <LanguageProvider>
          <MotionProvider>
            <SiteHeader />
            <main className="wrap">{children}</main>
            <SiteFooter />
          </MotionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
