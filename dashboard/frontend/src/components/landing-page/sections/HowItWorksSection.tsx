"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Headphones } from "lucide-react";
import StepItem from "@/components/landing-page/StepItem";
import { cn } from "@/lib/utils";

export default function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState(0);
  
  // Auto-transition between tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 4);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      number: 1,
      title: "Overview",
      description: "Get a comprehensive summary of the meeting, including key points, action items, and follow-ups.",
      image: "/overview.png"
    },
    {
      number: 2,
      title: "Bullet Points",
      description: "Get a list of key points and takeaways from the meeting.",
      image: "/bullet-points.webp"
    },
    {
      number: 3,
      title: "Action Items",
      description: "Get a list of action items and follow-ups from the meeting.",
      image: "/action-items.png"
    },
    {
      number: 4,
      title: "Custom Notes",
      description: "Get a list of custom notes and takeaways from the meeting.",
      image: "/custom-notes.png"
    }
  ];

  return (
    <section id="how-it-works" className="container mx-auto items-center justify-center w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-indigo-950 to-black text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-indigo-600/10 text-indigo-500">
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Comprehensive AI Summaries</h2>
            <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Get detailed notes, action items, and customized summaries instantly after every meeting.
            </p>
          </div>
        </div>
        
        <div className="mx-auto max-w-5xl py-12">
          {/* Tab buttons */}
          <div className="flex justify-center mb-8 gap-2">
            {steps.map((step, index) => (
              <button
                key={step.number}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "px-4 py-2 rounded-md transition-all",
                  activeTab === index 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                )}
              >
                {step.title}
              </button>
            ))}
          </div>
          
          {/* Tab content */}
          <Card className="relative rounded-xl overflow-hidden border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <div className="aspect-[16/9] w-full">
              {/* Each tab has its own image */}
              {steps.map((step, index) => (
                <div 
                  key={step.number}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-500",
                    activeTab === index ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  <Image
                    src={step.image}
                    alt={`${step.title} interface`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
} 