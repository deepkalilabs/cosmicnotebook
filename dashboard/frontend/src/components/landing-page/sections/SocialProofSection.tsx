import React from "react";
import Image from "next/image";

export default function SocialProofSection() {
  return (
    <section className="w-full border-t border-gray-800 py-8">
      <div className="container px-4 md:px-6 text-center">
        <p className="text-sm font-medium tracking-wider text-gray-400">
          USED ACROSS 10,000+ PROFESSIONALS
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-8 grayscale opacity-70">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8">
              <Image
                src="/placeholder.svg?height=32&width=120"
                width={120}
                height={32}
                alt={`Company logo ${i + 1}`}
                className="h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 