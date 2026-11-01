"use client";

import { useLang } from "@/lib/i18n";

export default function SiteFooter() {
  const { t } = useLang();

  return (
    <footer className="site-footer">
      <span>
        © {new Date().getFullYear()} ·{" "}
        <a href="https://jorgecalleja.dev" target="_blank" rel="noopener noreferrer">
          Diseño Web Málaga
        </a>{" "}
        · v2.0.0 · {t("footerBeta")}
      </span>
    </footer>
  );
}
