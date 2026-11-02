import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BRAND, SITE_NAME, VERSION } from "../site";

describe("site constants", () => {
  it("keeps the footer version in sync with package.json", () => {
    const pkg = JSON.parse(readFileSync(join(__dirname, "../../package.json"), "utf8"));
    expect(VERSION).toBe(pkg.version);
  });

  it("splits the brand name for the header", () => {
    expect(BRAND.lead + BRAND.accent).toBe(SITE_NAME);
  });
});
