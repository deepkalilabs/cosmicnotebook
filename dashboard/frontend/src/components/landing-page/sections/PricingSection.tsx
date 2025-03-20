import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PreOrderButton from "@/components/PreOrderButton";

const tiers = [
  {
    name: 'Starter',
    price: 'Free',
    description: '$99 one-time payment for 1 device.',
    features: [
      'Cosmic wearable device',
      '8 hours of recording per month',
      'Basic transcription',
      '7-day conversation history',
      'Export to text format',
      'Email support'
    ],
    button: 'Pre-order Now',
    action: '/checkout/starter',
    highlight: false
  },
  {
    name: 'Professional',
    price: '$199/mo',
    description: 'Free device. Monthly subscription.',
    features: [
      'Everything in Starter',
      '40 hours of recording per month',
      'Advanced transcription',
      'AI-powered summaries',
      '30-day conversation history',
      'Sync to CRM',
      'Priority support'
    ],
    button: 'Pre-order Now',
    action: '/checkout/professional',
    highlight: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Free devices. Contact us for more details.',
    features: [
      'Multiple Cosmic devices',
      'Unlimited recording',
      'Premium transcription',
      'Advanced AI summaries',
      'Unlimited conversation history',
      'Team collaboration features',
      'Custom integrations',
      'Dedicated support'
    ],
    button: 'Contact Sales',
    action: 'mailto:shikharsakhuja@gmail.com',
    highlight: false
  }
];

export default function PricingSection() {
  return (
    <div className="flex flex-col gap-16 w-full mx-auto bg-gradient-to-l from-white to-indigo-600/40">
    <section id="pricing" className="container mx-auto items-center justify-center w-full py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that works best for your needs
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={`flex flex-col relative ${
                tier.highlight 
                  ? 'border-2 border-indigo-500 bg-white shadow-lg' 
                  : 'border border-gray-200 bg-white'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                {/* <CardDescription className="text-gray-500">{tier.description}</CardDescription> */}
                <div className="mt-4 text-4xl font-bold">
                  {tier.price}
                </div>
                <p className="mt-1 text-sm text-gray-500">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-x-3">
                      <Check className="h-5 w-5 flex-none text-indigo-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {tier.button === 'Pre-order Now' ? (
                  <PreOrderButton
                    variant={tier.highlight ? 'highlight' : 'outline'}
                    size="lg"
                    className="w-full"
                  />
                ) : (
                  <Button 
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-6"
                    asChild
                  >
                    <a href={tier.action}>{tier.button}</a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}
