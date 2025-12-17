import React from 'react'
import Image from 'next/image'

export function StatsPanel() {
  return (
    <div className="relative w-full h-full">
      <Image 
        src="/LoginLeftImage.svg" 
        alt="Hire Faster, Screen Intelligently" 
        fill
        className="object-cover"
        priority
      />
    </div>
  )
}
