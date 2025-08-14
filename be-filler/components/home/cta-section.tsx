"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const CTASection = () => {
  const benefits = [
    "Easy and intuitive online filing process",
    "Expert tax consultants available for support",
    "Secure handling of your sensitive information",
    "Affordable service packages for all needs",
    "Compliance with latest FBR regulations",
    "Detailed support for wealth statements",
  ]

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-full bg-green-50 -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-100 rounded-full -z-10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-100 rounded-full -z-10 blur-3xl" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto bg-card rounded-xl p-8 md:p-12 shadow-lg border">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-4">Ready to File Your Taxes?</h2>
                <p className="text-muted-foreground mb-6">
                  Join thousands of satisfied customers who have simplified their tax filing process with Pakfiler.
                </p>

                <ul className="space-y-2 mb-8">
                  {benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <CheckCircle className="w-5 h-5 text-[#15803d] mr-2 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/signup">
                    <Button size="lg" className="bg-[#15803d] hover:bg-green-700 w-full sm:w-auto">
                      Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="flex-1 lg:flex-none lg:w-1/3 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative h-80 w-full md:w-80"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 rounded-lg" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-[#15803d]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Start Today</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign up in minutes and get your taxes handled professionally
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
