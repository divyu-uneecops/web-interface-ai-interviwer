"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[rgba(0,0,0,0.1)]">
      <div className="container mx-auto px-8 h-[72px] flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm text-[#0a0a0a] hover:text-[#02563d] transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm text-[#0a0a0a] hover:text-[#02563d] transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-[#0a0a0a] hover:text-[#02563d] transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#product-flow"
            className="text-sm text-[#0a0a0a] hover:text-[#02563d] transition-colors"
          >
            Product Flow
          </Link>
          <Link
            href="#product-spec"
            className="text-sm text-[#0a0a0a] hover:text-[#02563d] transition-colors"
          >
            Product Spec
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="secondary">Free Trial</Button>
          <Link href="/login">
            <Button variant="default">Sign In</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
