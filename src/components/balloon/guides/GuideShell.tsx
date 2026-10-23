import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "../site-header";
import { SiteLiquidBackground } from "../site-liquid-background";
import { guideLinks } from "@/lib/celebration-guides";
import "./guides.css";
export function GuideShell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <div className="site-liquid-shell">
      <SiteLiquidBackground />
      <SiteHeader />
      <main id="main" className="guide-page page-width">
        <nav className="guide-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">
            <ArrowLeft size={15} aria-hidden="true" /> Home
          </Link>
          <span aria-hidden="true">/</span>
          <span>{current}</span>
        </nav>
        <nav className="guide-tabs" aria-label="Celebration guides">
          {guideLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-label={link.label}
              activeProps={{ "aria-current": "page" }}
            >
              {link.to === "/signature-standard"
                ? "Our standard"
                : link.to === "/lets-celebrate"
                  ? "Plan with us"
                  : link.label}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </nav>
        {children}
        <div className="guide-end">
          <span>YOUR OCCASION. YOUR PACE.</span>
          <Link to="/" hash="portfolio">
            Browse all 20 occasions <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </main>
    </div>
  );
}
