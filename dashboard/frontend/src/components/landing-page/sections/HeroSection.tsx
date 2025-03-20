import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PreOrderButton from "@/components/PreOrderButton";
export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-white to-indigo-600/40 text-black">
      <section id="home" className="w-full py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-col justify-center space-y-4 max-w-3xl mb-12">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Turn Trade Show Conversations Into Sales.
                <br/> 
                <span className="text-indigo-600">Without Taking Notes</span>
                </h1>
                <p className="text-gray-600 md:text-xl">
                    Cosmic is a wearable device that automatically transcribes, summarizes, and syncs sales conversations at conferences to your CRM. 
                    <br/>
                    <span className="text-slate-600 text-md font-bold">Save 15+ hours of manual work after each event. Close more deals.</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <PreOrderButton className="text-md size-lg py-6" />
                <Button size="lg" variant="default" className="border-gray-700 text-white text-md py-6 hover:bg-gray-800">
                  Request demo
                </Button>
              </div>
              <p className="text-gray-600 text-md">* 100% money back guarantee within 3 months if you are not satisfied.</p>
            </div>
            
            <div className="relative w-full mx-auto mt-8">
              <Card className="p-6 rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left column for pendant images */}
                  <div className="md:col-span-3 flex flex-col gap-6">
                    <div className="relative aspect-square overflow-hidden rounded-xl">
                      <Image 
                        src="/pendant.jpg"
                        fill
                        sizes="(max-width: 512px) 100vw, 33vw"
                        alt="Cosmic recording pendant"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        priority
                      />
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-xl">
                      <Image 
                        src="/pendant2.png"
                        fill
                        sizes="(max-width: 512px) 100vw, 33vw"
                        alt="Cosmic recording pendant"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        priority
                      />
                    </div>
                  </div>
                  
                  {/* Right column for transcription image */}
                  <div className="relative md:col-span-9 overflow-hidden rounded-xl flex items-stretch h-full">
                    <div className="relative w-full h-full">
                      <Image
                        src="/transcription.png"
                        fill
                        sizes="(max-width: 768px) 200vw, 66vw"
                        alt="Cosmic transcription interface"
                        className="object-contain hover:scale-105 transition-transform duration-300 rounded-xl"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}