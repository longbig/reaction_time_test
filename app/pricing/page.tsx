import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AuthHeader from "@/components/auth-header"
import { createClient } from "@/utils/supabase/server"

export const metadata: Metadata = {
  title: "Pricing - Reaction Time Test",
  description: "Choose a plan. Upgrade to Pro to unlock advanced stats and an ad‑free experience.",
}

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    highlight: false,
    description: "Everything you need to try the reaction time test.",
    features: [
      "Play the Reaction Time game",
      "History of your latest run",
      "Basic tips to improve",
      "Community‑friendly",
    ],
    cta: { label: "Start Free", href: "/" },
  },
  {
    name: "Pro",
    price: "$9",
    period: "one‑time",
    highlight: true,
    description: "Advanced stats and an ad‑free experience.",
    features: [
      "No ads, distraction‑free",
      "Per‑attempt breakdown & best streak",
      "Export results (CSV)",
      "Early access to new games",
      "Priority support",
    ],
    // PayPal payment link opens in a new tab
    cta: { label: "Upgrade with PayPal", href: "https://www.paypal.com/ncp/payment/RVTU29PW4FVH4" },
  },
]

export default async function PricingPage() {
  const supabase = await createClient()
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } }
  const user = data?.user ?? null
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <AuthHeader user={user} />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">Pricing</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Simple pricing to get you playing faster. Upgrade to Pro to remove ads and unlock advanced stats.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlight ? "border-primary shadow-lg" : ""}
            >
              <CardHeader>
                <CardTitle className="flex items-baseline justify-between">
                  <span>{plan.name}</span>
                  <span className="text-2xl font-semibold">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                  </span>
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary/80" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.cta.href.startsWith("http") ? (
                  <Button asChild className="w-full">
                    <a
                      href={plan.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {plan.cta.label}
                    </a>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full">
                    <Link href={plan.cta.href}>{plan.cta.label}</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Payments are securely processed by PayPal. By upgrading you agree to our terms of service.
        </p>
      </div>
    </div>
  )
}
