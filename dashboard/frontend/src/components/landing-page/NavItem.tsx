import React from "react";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  label: string;
}

export default function NavItem({ label }: NavItemProps) {
  return (
    <div className="relative group">
      <Button
        variant="ghost"
        className="flex items-center text-sm font-medium text-black hover:text-gray"
      >
        {label}
        <svg
          className="ml-1 h-4 w-4 opacity-70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>
    </div>
  );
} 