"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, AlertTriangle, FileText, Shield, Scale } from "lucide-react"

export default function CompliancePage() {
  const complianceServices = [
    {
      title: "Tax Compliance Review",
      description: "Comprehensive review of your tax compliance status and identification of potential risks.",
      icon: FileText,
    },
    {
      title: "FBR Notice Handling",
      description: "Expert assistance in responding to FBR notices and audit requirements.",
      icon: AlertTriangle,
    },
    {
      title: "Regulatory Compliance",
      description: "Ensuring adherence to latest FBR regulations and compliance requirements.",
      icon: Shield,
    },
    {
      title: "Legal Advisory",
      description: "Professional guidance on tax laws and regulatory frameworks.",
      icon: Scale,
    },
  ]

  const benefits = [
    "Minimize compliance risks and penalties",
    "Stay updated with changing regulations",
    "Expert handling of tax notices",
    "Proactive risk management",
    "Dedicated compliance support",
    "Regular compliance health checks",
  ]

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-12 bg-[#15803d]/5">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-6"
            >
              Tax Compliance & Advisory Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Stay compliant with FBR regulations and handle tax matters professionally with our expert advisory
              services.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Link href="/auth/signup">
                <Button size="lg" className="bg-[#15803d] hover:bg-[#11632a]">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Compliance Services</h2>
            <p className="text-muted-foreground">
              Comprehensive compliance solutions to keep your business aligned with tax regulations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-[#15803d]/10 rounded-lg flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-[#15803d]" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-card">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Our Compliance Services?</h2>
              <p className="text-muted-foreground">Expert guidance and support to ensure your tax compliance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-background"
                >
                  <CheckCircle className="h-5 w-5 text-[#15803d] flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold">Ready to ensure your tax compliance?</h3>
                <p className="text-muted-foreground">
                  Get started with our compliance services today and ensure your business stays aligned with tax
                  regulations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signup">
                    <Button size="lg" className="bg-[#15803d] hover:bg-[#11632a] w-full sm:w-auto">
                      Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
