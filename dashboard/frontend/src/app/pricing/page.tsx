import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const tiers = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for getting started with workflows',
      features: [
        'Up to 3 workflows with a certain amount of runs',
        'Observability',
        'Logging',
        'Deployment'
    
    ],
    },
    {
      name: 'Pro',
      price: '$50/month per seat + usage pricing',
      description: 'For teams that need to scale',
      features: [
        'Everything in Basic',
        'Seat license',
        'Dedicated support on Slack',
        'Zoom support sessions',
        'Unlimited users',
        'Unlimited workflows',
        'Unlimited integrations',
        'Unlimited triggers',
        'Unlimited actions',
        'Unlimited schedules',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with custom needs',
      features: [
        'Everything in Pro',
        'Dedicated SLAs',
        'Advanced security',
        'Compliance features'
      ],
    },
  ]
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 lg:px-8 pt-20 pb-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-serif font-bold tracking-tight lg:text-5xl mb-6">Pricing</h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that is right for you
          </p>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-4 text-lg font-bold">
                {tier.price}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-x-3">
                    <Check className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Get started
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      </div>
      <Footer />
    </div>
  )
}