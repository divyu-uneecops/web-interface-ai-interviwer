"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Interviewer {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  roundType: string;
}

interface InterviewerCardProps {
  interviewer: Interviewer;
  onEdit?: (id: string) => void;
}

export function InterviewerCard({ interviewer, onEdit }: InterviewerCardProps) {
  return (
    <div className="bg-white border border-[#d1d1d1] rounded p-2 flex flex-col">
      {/* Image Container with Badge */}
      <div className="relative w-full aspect-square rounded overflow-hidden mb-1">
        <Image
          src={interviewer.imageUrl}
          alt={interviewer.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Badge positioned at bottom of image */}
        <div className="absolute bottom-2 left-0">
          <Badge
            variant="outline"
            className="bg-white border-[#e5e5e5] text-[#0a0a0a] text-xs font-semibold px-2 py-0.5 rounded-md"
          >
            {interviewer.roundType}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="text-sm font-bold text-[#0a0a0a] leading-5">
          {interviewer.name}
        </h3>
        <p className="text-xs text-[#737373] leading-5 line-clamp-2">
          {interviewer.description}
        </p>
      </div>

      {/* Edit Button */}
      <div className="mt-1">
        <Button
          variant="secondary"
          size="default"
          className="w-full h-9 shadow-xs"
          onClick={() => onEdit?.(interviewer.id)}
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
      </div>
    </div>
  );
}
