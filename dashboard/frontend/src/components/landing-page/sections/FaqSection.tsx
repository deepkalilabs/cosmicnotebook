"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Headphones, Plus, Minus } from "lucide-react"

interface FAQItem {
  question: string
  answer: string | React.ReactNode
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0)

  const faqItems: FAQItem[] = [
    {
      question: "How much does Cosmic cost?",
      answer: "For now, Cosmic is 99$ for pre-orders and no subscription is required. If you're interested in the premium features, we'll waive the device cost and launch a subscription model for 199$ in Q2 2025.",
    },
    {
      question: "What's included in the box?",
      answer: (
        <div>
          <p className="mb-4">Each Cosmic package includes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Cosmic wearable device</li>
            <li>Charging case</li>
            <li>USB-C charging cable</li>
            <li>Quick start guide</li>
            <li>Access to the Cosmic mobile app</li>
          </ul>
        </div>
      ),
    },
    {
      question: "When will I receive my Cosmic?",
      answer:
        "Pre-orders will begin shipping in Q1 2025. Once your order is processed, you'll receive a confirmation email with tracking information.",
    },
    {
      question: "What does 'always listening' mean?",
      answer:
        "Cosmic works throughout your trade show day distinguishing meaningful conversations from background noise. The goal is to help you focus on building relationships while Cosmic automatically captures the interactions that matter, ensuring no valuable insight is ever lost in the hustle of a busy event floor.",
    },
    {
      question: "Do I need a phone to be able to use the device?",
      answer:
        "Yes, Cosmic requires a smartphone (iOS or Android) to access all features. The device can record offline, but you'll need the app to view transcriptions, summaries, and to manage your recordings.",
    },
    {
      question: "What phone do I need to use Cosmic?",
      answer:
        "Cosmic is compatible with iPhone (iOS 14 or later) and Android devices (Android 10 or later) with Bluetooth 5.0 capability.",
    },
    {
      question: "What happens when I break the device?",
      answer:
        "Cosmic comes with a 1-year limited warranty that covers manufacturing defects. If your device breaks due to normal wear and tear within the warranty period, we'll replace it. Accidental damage is not covered, but we offer a replacement program at a reduced cost.",
    },
    {
      question: "How is my privacy protected?",
      answer:
        "We take privacy seriously. All recordings are encrypted both on the device and in the cloud. You have complete control over your data and can delete recordings at any time. We never share your recordings or transcripts with third parties without your explicit permission.",
    },
    {
      question: "How can I contact you?",
      answer:
        "You can reach our support team at shikharsakhuja@gmail.com or through the help section in the Cosmic app. Our customer service hours are Monday 12am to Sunday 11:59pm EST.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section id="faq" className="w-full py-16 md:py-24 lg:py-32">

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-5xl font-serif text-center mb-16">FAQ</h1>

        <div className="border-t border-gray-200">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                className="w-full py-6 flex justify-between items-center text-left"
                onClick={() => toggleFAQ(index)}
              >
                <h2 className="text-xl font-serif">{item.question}</h2>
                <div className="flex-shrink-0 h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center">
                  {openIndex === index ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </button>
              {openIndex === index && <div className="pb-6 text-gray-600 font-light">{item.answer}</div>}
            </div>
          ))}
        </div>
      </main>
    </section>
  )
}

