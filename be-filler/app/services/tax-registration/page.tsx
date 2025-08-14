"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileCheck, Shield, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TaxRegistrationPage() {
  const registrationTypes = [
    {
      title: "NTN Registration",
      description: "National Tax Number registration for individuals",
      requirements: ["Valid CNIC", "Proof of address", "Bank account details", "Source of income proof"],
    },
    {
      title: "Business Registration",
      description: "Tax registration for businesses and companies",
      requirements: [
        "Company incorporation documents",
        "NTN of directors",
        "Business address proof",
        "Bank account details",
      ],
    },
    {
      title: "Sales Tax Registration",
      description: "Registration for sales tax and GST",
      requirements: ["Business NTN", "Bank account statements", "Utility bills", "Business ownership proof"],
    },
  ]

  const benefits = [
    {
      icon: FileCheck,
      title: "Quick Processing",
      description: "Get your registration processed within 3-5 working days",
    },
    {
      icon: Shield,
      title: "Complete Compliance",
      description: "Ensure full compliance with FBR regulations and requirements",
    },
    {
      icon: Clock,
      title: "Time Saving",
      description: "Save time with our streamlined registration process",
    },
  ]

  return (
    <main className="container mx-auto px-4 py-16 mt-16">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Tax Registration Made Simple</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Get registered with FBR quickly and easily. Our expert team handles the entire process, ensuring compliance
            and timely completion.
          </p>
          <div className="flex gap-4">
            <Link href="/auth/signup">
              <Button className="bg-[#15803d] hover:bg-[#11632a]">
                Register Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Learn More</Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2">
          <Image
            src="https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg"
            alt="Tax Registration"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Registration Types */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Registration Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {registrationTypes.map((type, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{type.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{type.description}</p>
                <h4 className="font-semibold mb-2">Requirements:</h4>
                <ul className="space-y-2">
                  {type.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[#15803d]" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#15803d]/10 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-[#15803d]" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#15803d]/5 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Registered?</h2>
        <p className="text-muted-foreground mb-6">
          Start your tax registration process today and get expert assistance at every step.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup">
            <Button className="bg-[#15803d] hover:bg-[#11632a]">
              Start Registration <ArrowRight className="ml-2 h-4 w-4" />
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
