import React, { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MessageSquareText, Zap, ArrowDownToLine, ArrowUpToLine, DollarSign, Activity } from "lucide-react";
import Image from "next/image";
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-indigo-500/30 border-gray-800">
      <CardContent className="p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/10">
          {icon}
        </div>
        <div className="space-y-2 mt-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
} 

export default function FeaturesSection() {
  const features = [
    {
      icon: <DollarSign className="h-6 w-6 text-indigo-400" />,
      title: "Maximize Your $30K Investment",
      description: "Companies spend $30K on a booth at a trade show. Cosmic helps you maximize ROI on by converting every conversation into a sale."
    },
    {
      icon: <Mic className="h-6 w-6 text-indigo-400" />,
      title: "Voice Clarity",
      description: "Record conversations perfectly even in crowded conference halls. Review conversations so you never miss a detail."
    },
    {
      icon: <MessageSquareText className="h-6 w-6 text-indigo-400" />,
      title: "Speaker Recognition",
      description: "Identify different speakers and know exactly who said what when reviewing conversations."
    },
    {
      icon: <Activity className="h-6 w-6 text-indigo-400" />,
      title: "Action Items",
      description: "Automatically creates action items from conversations for your team to review. Close more deals by following up on the right things."
    },
    {
      icon: <ArrowUpToLine className="h-6 w-6 text-indigo-400" />,
      title: "Sync to CRM",
      description: "Automatically creates new contacts, logs conversation summaries, and flags follow-up items directly in Salesforce. Save 15+ hours of manual work per trade show."
    },
    {
      icon: <Zap className="h-6 w-6 text-indigo-400" />,
      title: "All-day Battery",
      description: "96+ hours of continuous use to last through the longest trade shows."
    }
  ];

  return (
    <div className="flex flex-col gap-16 w-full mx-auto bg-gradient-to-bl from-indigo-50 to-slate-100 px-12">
    <section id="features" className="container mx-auto items-center justify-center w-full py-16 md:py-24 lg:py-32">
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 w-full">
          {/* Left column with heading and features */}
          <div className="flex flex-col space-y-8 md:col-span-2">
            <div className="flex flex-col space-y-4">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tighter md:text-5xl/tight">
                  High Quality Meeting<br />
                  <span className="text-indigo-600">Transcription & Recording</span>
                </h2>
              </div>
              <div className="pt-4">
                <a href="#get-started" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition-colors">
                  Pre-order Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right column with image */}
          <div className="flex justify-end items-center">
            <Image 
              src="/feature-section.webp" 
              alt="Overview" 
              width={600} 
              height={600}
              className="shadow-xs" 
            />
          </div>
        </div>
      </div>
    </section>
    </div>
  );
} 