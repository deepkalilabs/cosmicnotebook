import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-indigo-400/30 border-gray-800">
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