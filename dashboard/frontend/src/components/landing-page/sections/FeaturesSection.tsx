import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MessageSquareText, Zap, DollarSign, Activity, Volume2 } from "lucide-react";
import Image from "next/image";
import PreOrderButton from "@/components/PreOrderButton";

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
      title: "Review each call to maximize ROI",
      description: "Companies spend $30K on a booth at a trade show. Cosmic records and transcribes each conversation and helps you stay on top of every conversation to ensure quality."
    },
    {
      icon: <Mic className="h-6 w-6 text-indigo-400" />,
      title: "Eliminate Note-taking",
      description: "Cosmic takes notes for you during conversations so you can focus on building relationships."
    },
    {
      icon: <MessageSquareText className="h-6 w-6 text-indigo-400" />,
      title: "Identify the right stakeholders",
      description: "Cosmic identifies different speakers in conversations and knows exactly who said what when reviewing conversations."
    },
    {
      icon: <Activity className="h-6 w-6 text-indigo-400" />,
      title: "Automate follow ups and CRM updates",
      description: "Cosmic automatically creates action items and CRM updates from conversations for your team to review. Close more deals by following up on the right things."
    },
    {
      icon: <Volume2 className="h-6 w-6 text-indigo-400" />,
      title: "Works seamlessly in loud environments",
      description: "Our proprietary AI model is trained to work in noisy environments, so you can get accurate transcripts even in loud environments."
    },
    {
      icon: <Zap className="h-6 w-6 text-indigo-400" />,
      title: "All-day Battery",
      description: "Cosmic has a 96+ hour battery life to last through the longest trade shows."
    }
  ];

  return (
    <div className="flex flex-col gap-14 w-full mx-auto bg-gradient-to-bl from-indigo-50/30 to-indigo-50">
    <section id="features" className="container mx-auto items-center justify-center w-full py-16 px-4 md:px-8 lg:pl-24 md:py-24 lg:py-32">
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 w-full">
          {/* Left column with heading and features */}
          <div className="flex flex-col space-y-8 md:col-span-2">
            <div className="flex flex-col space-y-4">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tighter md:text-5xl/tight">
                  Maximize the ROI of your <br />
                  <span className="text-indigo-600">Trade Show Investment</span>
                </h2>
              </div>
              <div className="pt-4">
                <PreOrderButton className="text-md size-lg py-6" />
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