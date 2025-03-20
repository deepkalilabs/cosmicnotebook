import React from "react";
import Link from "next/link";
import { Headphones } from "lucide-react";

export default function Footer() {
  return (
    <footer className="container mx-auto  items-center w-full border-t border-gray-800 py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex gap-2 items-center text-lg font-bold">
          <Headphones className="h-5 w-5 text-indigo-500" />
          <span>Cosmic</span>
        </div>
        <p className="text-center text-sm leading-loose text-gray-400 md:text-left">
          &copy; {new Date().getFullYear()} Cosmic Inc. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-gray-400 underline-offset-4 hover:text-white hover:underline">
            Terms
          </Link>
          <Link href="#" className="text-sm text-gray-400 underline-offset-4 hover:text-white hover:underline">
            Privacy
          </Link>
          <Link href="#" className="text-sm text-gray-400 underline-offset-4 hover:text-white hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
} 