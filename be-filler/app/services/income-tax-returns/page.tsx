"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, BarChart4 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function IncomeTaxReturnsPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <main className="container mx-auto px-4 py-16 mt-16">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Income Tax Returns</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Complete your income tax return filing with Pakfiler. Our comprehensive service includes both the Income Tax
            Return form and Wealth Statement form, ensuring full compliance with FBR requirements.
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
            alt="Income Tax Returns"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Components Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Income Tax Return Components</h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-10">
          The Income Tax Return consists of two essential components that must be filed together for complete compliance
          with FBR regulations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <motion.div
            className="h-full"
            initial="initial"
            animate="animate"
            variants={fadeIn}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#15803d]/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-[#15803d]" />
                </div>
                <CardTitle className="text-2xl">Tax Filing</CardTitle>
                <CardDescription className="mt-2">
                  The first component of your income tax return where you declare your income, deductions, and calculate
                  your tax liability.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#15803d] font-bold">•</span>
                    <span>Income declaration from all sources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#15803d] font-bold">•</span>
                    <span>Deductions and tax credits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#15803d] font-bold">•</span>
                    <span>Tax calculation and payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#15803d] font-bold">•</span>
                    <span>Business income reporting</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/services/income-tax-returns/tax-filing" className="w-full">
                  <Button variant="outline" className="w-full text-[#15803d] hover:text-[#15803d] hover:bg-[#15803d]/5">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            className="h-full"
            initial="initial"
            animate="animate"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#15803d]/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart4 className="w-6 h-6 text-[#15803d]" />
                </div>
                <CardTitle className="text-2xl">Wealth Statement</CardTitle>
                <CardDescription className="mt-2">
                  The second component where you declare your assets, liabilities, and expenses to provide a complete
                  financial picture.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#15803d] font-bold">•</span>
                    <span>Assets and properties declaration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#15803d] font-bold">•</span>
                    <span>Liabilities and loans reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#15803d] font-bold">•</span>
                    <span>Personal expenses reconciliation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#15803d] font-bold">•</span>
                    <span>Capital gains and investments</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/services/income-tax-returns/wealth-statement" className="w-full">
                  <Button variant="outline" className="w-full text-[#15803d] hover:text-[#15803d] hover:bg-[#15803d]/5">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mb-16 bg-card p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Pakfiler for Income Tax Returns</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-background">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Complete Solution</h3>
              <p className="text-muted-foreground">
                We handle both components of your income tax return in one seamless process, ensuring nothing is missed.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
              <p className="text-muted-foreground">
                Our tax professionals provide personalized support throughout the filing process.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Compliance Assurance</h3>
              <p className="text-muted-foreground">
                We ensure your return meets all FBR requirements, minimizing the risk of audits or penalties.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Time Saving</h3>
              <p className="text-muted-foreground">
                Our streamlined process saves you hours of research and form-filling time.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Digital Documentation</h3>
              <p className="text-muted-foreground">
                Secure digital storage of all your tax documents for easy access in the future.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Year-Round Support</h3>
              <p className="text-muted-foreground">
                Get assistance with tax-related queries throughout the year, not just during filing season.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What is the difference between Tax Filing and Wealth Statement?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tax Filing focuses on your income and tax calculation for the year, while the Wealth Statement provides
                a comprehensive picture of your assets, liabilities, and expenses. Both are required components of a
                complete Income Tax Return.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Do I need to file both components?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes, for a complete and compliant Income Tax Return, both the Tax Filing and Wealth Statement components
                must be submitted. Our service handles both components seamlessly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What happens if I only file one component?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Filing only one component results in an incomplete return, which may lead to compliance issues with FBR.
                Both components are necessary for a complete filing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How long does the complete process take?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                With all documents ready, the complete Income Tax Return filing process typically takes 45-60 minutes
                through our platform. Our experts can expedite the process further.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#15803d]/5 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to File Your Income Tax Return?</h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of satisfied customers who trust Pakfiler with their complete tax filing needs.
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
