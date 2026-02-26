"use client";

import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 no-underline">
      <div className="flex items-center justify-center w-10 h-10 bg-[#02563d] rounded-[10px] shrink-0">
        <img src="/Icon.svg" alt="Logo" width={24} height={24} />
      </div>
      <div className="text-xl leading-7 tracking-tight">
        <span className="font-bold text-[#02563D]">AI </span>
        <span className="font-normal text-[#02563D]">Interview</span>
      </div>
    </Link>
  );
}
