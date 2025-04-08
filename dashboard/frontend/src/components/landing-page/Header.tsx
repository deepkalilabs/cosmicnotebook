"use client";
import React from "react";
import Link from "next/link";
import { Headphones } from "lucide-react";
import PreOrderButton from "@/components/PreOrderButton";
export default function Header() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full border-b border-gray-200 bg-white z-50 shadow-sm opacity-90">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-medium">
          <Headphones className="h-5 w-5" />
          <span>Cosmic</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/home" 
            className="text-md text-gray-600 hover:text-black"
            onClick={(e) => scrollToSection(e, 'home')}
          >
            Home
          </Link>
          <Link 
            href="/features" 
            className="text-md text-gray-600 hover:text-black"
            onClick={(e) => scrollToSection(e, 'features')}
          >
            Features
          </Link>
          <Link 
            href="/integrations" 
            className="text-md text-gray-600 hover:text-black"
            onClick={(e) => scrollToSection(e, 'integrations')}
          >
            Integrations
          </Link>
          <Link 
            href="#pricing" 
            className="text-md text-gray-600 hover:text-black"
            onClick={(e) => scrollToSection(e, 'pricing')}
          >
            Pricing
          </Link>
          <Link 
            href="/faq" 
            className="text-md text-gray-600 hover:text-black"
            onClick={(e) => scrollToSection(e, 'faq')}
          >
            FAQ
          </Link>
          <Link 
            href="https://how-to-record-in-person--bzv7ly8.gamma.site/" 
            className="text-md text-gray-600 hover:text-black"
          >
            Consent Tips
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {/* <Link
            href="#"
            className="hidden md:inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100"
          >
            Login
          </Link> */}
          <PreOrderButton />
        </div>
      </div>
    </header>
  );
} 