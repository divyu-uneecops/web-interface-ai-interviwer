"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Header({ isUser = false }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isUser) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isUser]);

  return (
    <header
      className={cn(
        "transition-all duration-500 ease-out",
        " bg-white/80 backdrop-blur-sm border-b border-[rgba(0,0,0,0.1)]",
        !isUser && "bg-white/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50",
        !isUser && scrolled && "shadow-[0_4px_30px_rgba(2,86,61,0.08)] border-b-[rgba(2,86,61,0.1)]",
      )}
    >
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Logo with entrance animation */}
        <div className="header-logo-enter">
          <Logo />
        </div>

        {!isUser && (
          <nav className="hidden md:flex items-center gap-0.5 header-nav-container">
            {[
              { href: "#features", label: "Features", delay: "0.12s" },
              { href: "#how-it-works", label: "How it Works", delay: "0.18s" },
              { href: "#pricing", label: "Pricing", delay: "0.24s" },
              { href: "#product-flow", label: "Product Flow", delay: "0.30s" },
              { href: "#product-spec", label: "Product Spec", delay: "0.36s" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="header-nav-link-v2 text-sm text-[#0a0a0a]"
                style={{ "--enter-delay": item.delay, fontFamily: "var(--ai-font-body)" } as React.CSSProperties}
              >
                {item.label}
                <span className="header-nav-underline" />
              </Link>
            ))}
          </nav>
        )}

        {!isUser && (
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="header-cta-btn header-btn-shine transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
              style={{ "--enter-delay": "0.42s" } as React.CSSProperties}
            >
              Free Trial
            </Button>
            <Link href="/login">
              <Button
                variant="default"
                className="header-cta-btn header-btn-glow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 bg-[#02563d] text-white hover:bg-[#02563d]/90 text-sm font-medium"
                style={{ "--enter-delay": "0.50s" } as React.CSSProperties}
              >
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
