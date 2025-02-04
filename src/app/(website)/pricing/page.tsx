import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const PricingPage = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "1GB max file size",
        "30 minutes max video duration",
        "720p video quality",
      ],
      buttonText: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$19.99",
      features: [
        "10GB max file size",
        "3 hours max video duration",
        "Up to 1080p video quality",
        "AI Chat for each video",
      ],
      buttonText: "Get Pro",
      popular: true,
    },
  ];

  return (
    <div className="py-16 flex flex-col items-center">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground text-lg">
          Choose the perfect plan for your video sharing needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-8 shadow-sm ${
              plan.popular
                ? "border-primary ring-2 ring-primary"
                : "border-border"
            }`}
          >
            <div className="flex flex-col h-full">
              <div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span className="ml-3">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <Link href="/auth/sign-up">
                  <Button
                    className={`w-full ${
                      plan.popular ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage; 