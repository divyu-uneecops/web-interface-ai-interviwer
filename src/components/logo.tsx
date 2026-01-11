"use client";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-10 h-10 bg-[#02563d] rounded-[10px]">
        <img src="/Icon.svg" alt="Logo" width={24} height={24} />
      </div>
      <div className="text-xl leading-7 tracking-tight">
        <span className="font-bold text-[#02563d]">AI </span>
        <span className="font-normal text-[#02563d]">Interview</span>
      </div>
    </div>
  );
}
