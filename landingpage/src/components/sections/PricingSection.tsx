"use client";

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import Button from "../ui/Button";

interface PricingPlanProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isFree?: boolean;
  isPopular?: boolean;
  isAnnual?: boolean;
  ctaText: string;
}

const PricingPlan: React.FC<PricingPlanProps> = ({
  name,
  price,
  description,
  features,
  isFree = false,
  isPopular = false,
  isAnnual = false,
  ctaText,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border ${
        isPopular ? "border-indigo-200 shadow-lg" : "border-gray-200 shadow-sm"
      } overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col h-full`}
    >
      {isPopular && (
        <div className="bg-indigo-600 text-white text-center py-1.5 text-sm font-medium">
          Most Popular
        </div>
      )}

      <div className="p-8 flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold text-gray-900">{price}</span>
          {!isFree && <span className="text-gray-600 ml-1">/month</span>}
        </div>
        <p className="text-gray-600 mb-6">
          {!isFree && `Billed ${isAnnual ? "yearly" : "monthly"}`}
        </p>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="ml-2 text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-8 pb-8">
        <Button
          variant={isPopular ? "primary" : "outline"}
          fullWidth
          href="https://app.aiseowrite.in/signup"
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};

const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "",
      isFree: true,
      features: [
        "5 AI Blog Articles",
        "Infography Generation",
        "Access Millions of Stock images",
        "100+ languages supported",
        "AI-powered Autoblogger",
        "10+ Apps Integration",
        "Email support",
      ],
      ctaText: "Get started for free",
    },
    {
      name: "Starter",
      price: isAnnual ? "$7.5" : "$15",
      description: "Billed monthly",
      features: [
        "25 AI Blog Articles / Month",
        "Analytics dashboard",
        "Infography & Image  Generation",
        "Access Millions of Stock images",
        "AI Meta Descriptions & FAQ Schemas",
        "100+ languages supported",
        "AI-powered Autoblogger",
        "Import & Sync 5 Sitemaps",
        "10+ Apps Integration",
        "5 User Accounts",
        "Priority Email & Live Chat support",
      ],
      isPopular: true,
      ctaText: "Get started for free",
    },
    {
      name: "Enterprise",
      price: isAnnual ? "$15" : "$30",
      description: "Billed monthly",
      features: [
        "100 AI Blog Articles",
        "Analytics dashboard",
        "Infography Generation for Blog",
        "100 AI Image Generations for Blog",
        "Access Millions of Stock images",
        "AI Meta Descriptions & FAQ Schemas",
        "100+ languages supported",
        "Import & Sync 15 Sitemaps",
        "AI-powered Autoblogger",
        "10+ Apps Integration",
        "10 User Accounts",
        "Analytics dashboard",
        "Priority Email & Live Chat Support",
      ],
      ctaText: "Get started for free",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Budget pricing for all use cases
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Enhance your blogging workflow with fluid & user-first AI-generated
            content.
          </p>

          <div className="flex items-center justify-center mb-8">
            <div className="bg-white border border-gray-200 p-1 rounded-xl inline-flex">
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 text-sm font-medium rounded-xl ${
                  isAnnual
                    ? "bg-indigo-600 text-white"
                    : "bg-transparent text-gray-700"
                }`}
              >
                Annual (50% off)
              </button>
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 text-sm font-medium rounded-xl ${
                  !isAnnual
                    ? "bg-indigo-600 text-white"
                    : "bg-transparent text-gray-700"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingPlan
              key={index}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              isFree={plan.isFree}
              isPopular={plan.isPopular}
              isAnnual={isAnnual}
              ctaText={plan.ctaText}
            />
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center mt-12">
          <p className="text-gray-600">
            All plans include a 7-day money-back guarantee. Try for free, No
            credit card required
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
