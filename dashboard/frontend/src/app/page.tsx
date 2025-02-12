'use client'

import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Code, ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'
import posthog from 'posthog-js'
import Image from 'next/image'

export default function Home() {
  useEffect(() => {
    posthog.capture('page_view', {
      path: '/',
      user_id: posthog.get_distinct_id(),
      referrer: document.referrer,
    })
  }, [])

  const customer_logos = [
    { id: 'pylon', name: 'Pylon', available: true, icon: `https://img.logo.dev/usepylon.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, link: 'https://usepylon.com'},
    { id: 'provision', name: 'Provision', available: false, icon: `https://img.logo.dev/useprovision.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, link: 'https://useprovision.com'},
    { id: 'horizon', name: 'Horizon', available: false, icon: `https://img.logo.dev/horizon.io?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`, link: 'https://horizon.io'},
  ];


  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="font-bold text-xl">
                <Image src="/cosmic-logo-big.png" alt="Logo" width={45} height={45} className="rounded-lg" />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signup">
                <Button variant="ghost">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-black-900 via-slate-800 to-black hover:from-blue-950 hover:via-slate-900 hover:to-black text-white">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <div className="container mx-auto px-4 lg:px-8 pt-20 pb-16">
        <div className="flex justify-center">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-50 text-gray-600 mb-8 text-sm font-medium">
              <h1 className="text-md">✨ AUTOMATE ANY BUSINESS PROCESS WITH AI IN 30 MINUTES</h1>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="max-w-2xl">
            <h1 className="text-5xl font-serif font-bold tracking-tight lg:text-5xl mb-6">
              Build & Ship AI Workflows that Automate Business Processes
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Grow your business 10x without increasing headcount.
              Techincal leaders love shipping AI workflows to automate business processes.
              Save 100+ hours of engineering and business time on every workflow you automate.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-900 via-slate-800 to-black hover:from-blue-950 hover:via-slate-900 hover:to-black text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-8 py-6 h-auto">
                  Deploy your first workflow
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full rounded-md"
                      src="https://www.youtube.com/embed/9D841EUYeqw"
                      title="Product Demo Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
              </div>
          </div>
        </div>
      </div>

      {/* Logos Section */}
      <div className="border-y bg-gray-50">
        <div className="container mx-auto px-12 py-8">
          <p className="text-center text-xl font-medium text-gray-600 mb-8">
            Join Companies Shipping AI 10x Faster
          </p>
          <div className="grid grid-cols-3 md:grid-cols-3 items-center justify-items-center">
            {customer_logos.map((source) => (
              <div key={source.id} className="h-12 w-12 bg-gray-200 rounded">
                <Link href={source.link}>
                  <Image src={source.icon} alt={source.name} width={100} height={100} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="flex items-center justify-center gap-4">
          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-blue-900 via-slate-800 to-black hover:from-blue-950 hover:via-slate-900 hover:to-black text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-8 py-6 h-auto">
              Deploy your first workflow
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="border-y bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8 py-16 bg-gray-50">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl mb-4">
            Build business automations without engineering overhead. 
          </h2>
          <p className="text-xl text-gray-600">
            Focus on automating business processes without engineering overhead. Grow your business 10x without increasing headcount. Get to production in record time and save 100+ hours.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-blue-900 mb-2">30min</div>
            <h3 className="font-medium mb-2">First Deployment</h3>
            <p className="text-sm text-gray-600">
              Go from idea to production-ready workflow in just 30 minutes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-blue-900 mb-2">100+</div>
            <h3 className="font-medium mb-2">Hours Saved</h3>
            <p className="text-sm text-gray-600">
              Save hundreds of engineering hours on every workflow you automate.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-blue-900 mb-2">Zero</div>
            <h3 className="font-medium mb-2">Infrastructure</h3>
            <p className="text-sm text-gray-600">
              No servers to manage, no DevOps required - we handle everything.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-blue-900 mb-2">10+</div>
            <h3 className="font-medium mb-2">Integrations</h3>
            <p className="text-sm text-gray-600">
              Pre-built integrations that work out of the box with your stack.
            </p>
          </div>
        </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="flex items-center justify-center gap-4">
          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-blue-900 via-slate-800 to-black hover:from-blue-950 hover:via-slate-900 hover:to-black text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-8 py-6 h-auto">
              Deploy your first workflow
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Value Props Section */}
      <div className="border-y bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl mb-4">
            Integrate and Deploy instantly
          </h2>
          <p className="text-xl text-gray-600">
            Integrate with your data sources and deploy to Slack, API, or Email. Automate out business processes in under 30 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Slack Bot",
              description: "Transform Slack data into automated team workflows and smart notifications.",
              icon: <Image src={`https://img.logo.dev/slack.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`} alt="Slack" width={100} height={100} />,
            },
            {
              title: "REST API",
              description: "Deploy instant API endpoints to connect with any service or application.",
              icon: <Code className="h-6 w-6" />,
            },
            {
              title: "Email",
              description: "Trigger smart email updates based on any workflow or event.",
              icon: <Mail className="h-6 w-6" />,
            },
            {
              title: "Posthog",
              description: "Predict customer churn with AI-powered analytics and automated alerts.",
              icon: <Image src={`https://img.logo.dev/posthog.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`} alt="Posthog" width={100} height={100} />,
            },
            {
              title: "Pylon",
              description: "Scale customer success with AI-driven responses and automated engagement.",
              icon: <Image src={`https://img.logo.dev/usepylon.com?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`} alt="Pylon" width={100} height={100} />,
            },
            {
              title: "Fathom",
              description: "Analyze and act on every call insight with automated transcription workflows.",
              icon: <Image src={`https://img.logo.dev/fathom.video/?token=${process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN}&retina=true`} alt="Fathom" width={100} height={100} />,
            }
          ].map((prop, i) => (
            <div key={i} className="relative group h-[210px]">
              <div className="absolute -inset-px bg-gradient-to-r from-blue-900 via-slate-800 to-black rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative h-full bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex flex-col items-start space-y-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                    {prop.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{prop.title}</h3>
                </div>
                <div className="mt-auto">
                  <p className="text-sm text-gray-600">
                    {prop.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 mt-8">
        <div className="flex items-center justify-center gap-4">
          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-blue-900 via-slate-800 to-black hover:from-blue-950 hover:via-slate-900 hover:to-black text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-8 py-6 h-auto">
              Deploy your first workflow
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <footer className="mt-16 border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <p className="text-center text-sm text-gray-500">
              
              <span className="float-left flex items-center gap-2">
                <Image src="/cosmic-logo-big.png" alt="Deep Kali Labs Logo" width={20} height={20} />
                <span>© 2025 Deep Kali Labs, Inc.</span>
              </span>
              <span className="float-right">Made with ❤️ in Toronto & SF</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
