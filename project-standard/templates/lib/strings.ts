// Interface strings for every language. Kept free of React so server code (metadata, structured data) can import it.
// Every key must exist in both languages; the `es` type enforces it.

export type Lang = "en" | "es";

export const en = {
  legend: "One-paragraph description of what the page does, shown under the header.",
  footerBeta: "Beta version",
  themeLight: "Switch to light mode",
  themeDark: "Switch to dark mode",
  language: "Language",
};

export type Key = keyof typeof en;

const es: { [K in Key]: (typeof en)[K] } = {
  legend: "Descripción de un párrafo de lo que hace la página, mostrada bajo la cabecera.",
  footerBeta: "Versión beta",
  themeLight: "Activar modo claro",
  themeDark: "Activar modo oscuro",
  language: "Idioma",
};

export const STRINGS = { en, es };
