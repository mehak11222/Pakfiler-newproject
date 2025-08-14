"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, FileText, Calculator, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TaxFilingPage() {
  const [activeTab, setActiveTab] = useState("individual")

  const features = {
    individual: [
      "Easy-to-use online filing system",
      "Step-by-step guidance",
      "Automatic calculations",
      "Document upload assistance",
      "Real-time status tracking",
      "Expert support available",
      "Wealth Statement Filing Included",
    ],
    business: [
      "Corporate tax filing",
      "Sales tax registration",
      "Multiple business support",
      "Financial statement preparation",
      "Tax planning advice",
      "Compliance monitoring",
    ],
    freelancer: [
      "Income declaration assistance",
      "Expense categorization",
      "Foreign income handling",
      "Tax savings optimization",
      "Payment proof management",
      "Annual planning support",
    ],
  }

  const process = [
    {
      title: "Information Gathering",
      description: "Provide your basic information and upload necessary documents",
      icon: FileText,
    },
    {
      title: "Calculation & Review",
      description: "Our system calculates your tax liability for your review",
      icon: Calculator,
    },
    {
      title: "Processing",
      description: "We process your return and handle submission to FBR",
      icon: Clock,
    },
    {
      title: "Completion",
      description: "Receive your filed return copy and payment challan",
      icon: CheckCircle,
    },
  ]

  return (
    <main className="container mx-auto px-4 py-16 mt-16">
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-900 to-red-700 text-white">
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Professional Tax Filing Services</h1>
          <p className="text-lg text-muted-foreground mb-8">
            File your taxes with confidence using our comprehensive tax filing service. Expert guidance and support
            available throughout the process. Includes Wealth Statement Filing as part of Income Tax Return.
          </p>
          <div className="flex gap-4">
            <Link href="/auth/signup">
              <Button className="bg-[#15803d] hover:bg-[#11632a]">
                Start Filing Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Get Expert Help</Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2">
          <Image
            src="https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg"
            alt="Tax Filing"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-16">
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="freelancer">Freelancer</TabsTrigger>
          </TabsList>
          {Object.entries(features).map(([key, featureList]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{key.charAt(0).toUpperCase() + key.slice(1)} Tax Filing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featureList.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-[#15803d]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Process Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {process.map((step, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#15803d]/10 rounded-lg flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-[#15803d]" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#15803d]/5 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to File Your Taxes?</h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of satisfied customers who trust Pakfiler with their tax filing needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup">
            <Button className="bg-[#15803d] hover:bg-[#11632a]">
              Start Filing Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact Support</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
