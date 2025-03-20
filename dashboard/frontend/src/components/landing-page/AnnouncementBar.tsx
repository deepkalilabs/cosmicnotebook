import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="relative w-full bg-indigo-600 py-2 px-4 text-center text-sm text-white">
      <div className="flex items-center justify-center">
        <span>Introducing Cosmic wearable device! 🔥</span>
        <Link href="#" className="ml-2 font-medium underline">
          Pre-order now
        </Link>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 text-white hover:text-gray-200"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
} 