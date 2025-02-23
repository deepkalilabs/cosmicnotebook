'use client'

import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Code, ArrowRight, Mail, Users, Shield, Server, Zap } from 'lucide-react'
import Link from 'next/link'
import posthog from 'posthog-js'
import Image from 'next/image'
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { toast } = useToast()

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
                <Button>
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <div className="container mx-auto px-4 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="max-w-2xl">
            <h1 className="text-5xl font-serif font-bold tracking-tight lg:text-5xl mb-6">
              Prototype. <br/>Iterate. Deploy.
            </h1>
            <p className="text-l text-gray-600 mb-8">
            Cosmic helps AI teams ship AI-workflows in 30 mins. No platform knowledge required. <br/>With a single click - your AI notebook is deployed to a live API. </p>
            <div className="flex items-center gap-4">
              <Link href="/auth/signup">
                <Button 
                  className="bg-gradient-to-r from-blue-900 via-slate-800 to-black hover:from-blue-950 hover:via-slate-900 hover:to-black"
                >
                  Deploy free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://cal.com/charlesjavelona/30min" target="_blank">
                <Button 
                  variant="outline"
                  className="border-2 border-blue-900"
                >
                  Contact Sales
                  <ArrowRight className="ml-2 h-4 w-4" />
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
      <div className="bg-white">
        <div className="container mx-auto px-12 py-8">
          <p className="text-center text-m font-medium text-gray-400 mb-8 uppercase">
            Proudly supporting amazing companies
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

      {/* Features Section */}
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                <Server className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">Zero config</h3>
              <p className="text-gray-600">
                Works out of the box with your existing notebook.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">Collaborative</h3>
              <p className="text-gray-600">
                Every change deploys to a shareable api endpoint.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning fast</h3>
              <p className="text-gray-600">
                Scalable, fast, and simple deployments.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Enterprise Ready</h3>
              <p className="text-gray-600">
                Built-in security and compliance controls.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="border-y">
        <div className="container mx-auto px-4 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-serif font-bold tracking-tight sm:text-4xl mb-4">
              Instant deployment of your AI notebooks
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Push to git - your AI notebook is deployed to a live API. Zero config required.
            </p>
            
            <div className="flex items-center justify-center gap-8">
              <Button 
                className="bg-gradient-to-r from-blue-900 via-slate-800 to-black hover:from-blue-950 hover:via-slate-900 hover:to-black px-6 py-2"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Notebook import feature is currently in development.",
                    duration: 3000,
                  })
                }}
              >
                Import Notebook
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-blue-900 px-6 py-2"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Example deployment feature is currently in development.",
                    duration: 3000,
                  })
                }}
              >
                Deploy Example
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            

            <div className="mt-8 rounded-lg overflow-hidden shadow-lg">
              <Image 
                src="/deployments.jpg" 
                alt="Deployment logs showing instant API creation" 
                width={800} 
                height={400} 
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Value Props Section */}
        <div className="bg-gray-100 py-16">
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
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-900 via-slate-800 to-black hover:from-blue-950 hover:via-slate-900 hover:to-black"
            >
              Deploy your first workflow
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-background border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy & Terms of Service</Link></li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li className="text-muted-foreground opacity-50 cursor-not-allowed flex items-center">
                  Customer Stories
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Coming Soon</span>
                </li>
                <li className="text-muted-foreground opacity-50 cursor-not-allowed flex items-center">
                  Recipes
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Coming Soon</span>
                </li>
              </ul>
            </div>

            {/* Engineering Section 
            <div>
              <h3 className="font-semibold text-lg mb-4">Engineering</h3>
              <ul className="space-y-3">
                <li><Link href="/changelog" className="text-muted-foreground hover:text-foreground">Changelog</Link></li>
                <li><Link href="/status" className="text-muted-foreground hover:text-foreground">Status</Link></li>
                <li><Link href="/docs" className="text-muted-foreground hover:text-foreground">Docs</Link></li>
              </ul>
            </div>
            */}

            {/* 
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
          */}
          </div>


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
        </div>
      </footer>
    </div>
  )
}
