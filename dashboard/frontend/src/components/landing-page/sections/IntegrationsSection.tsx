import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import PreOrderButton from "@/components/PreOrderButton";

export default function IntegrationsSection() {
  const integrations = [
    {
      title: "CRM",
      description: "Auto-fill out your CRM with notes and call logs.",
      icons: ["/salesforce.svg", "/hubspot.svg"],
      count: "2+"
    },
    {
      title: "Project Management",
      description: "Create tasks automatically after every meeting.",
      icons: ["/asana.svg", "/trello.svg"],
      count: "2+"
    },
    {
      title: "Slack",
      description: "Get notes and alerts in the channels where you work.",
      icons: ["https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg"],
      count: ""
    }
  ];

  return (
    <section id="integrations" className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-bl from-indigo-50 to-indigo-50/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tighter md:text-5xl/tight text-black">
            Integrate Cosmic With
            <br />
            <span className="text-indigo-500">Your Favorite Work Tools</span>
        </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrations.map((integration, index) => (
            <Card key={index} className="border-gray-800 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {integration.icons.map((icon, i) => (
                  <div key={i} className="relative mr-2">
                    <Image
                      src={icon}
                      alt={`${integration.title} icon`}
                      width={48}
                      height={48}
                    />
                  </div>
                ))}
                {integration.count && (
                  <span className="text-sm text-gray-600 ml-1">{integration.count}</span>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{integration.title}</h3>
              <p className="text-gray-600">{integration.description}</p>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <PreOrderButton className="text-md size-lg py-6" />
        </div>

      </div>
    </section>
  );
}
