"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState("individuals")

  const tabs = [
    { id: "individuals", label: "For Individuals" },
    { id: "businesses", label: "For Businesses" },
    { id: "freelancers", label: "For Freelancers" },
  ]

  return (
    <section className="relative pb-16 pt-32 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 -z-10" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#15803d]/5 -z-20 dark:bg-[#15803d]/10 transform -skew-y-6" />

      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Tax Filing Made <span className="text-[#15803d]">Simple</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Pakistan's leading online tax filing platform. We make tax compliance easy, affordable, and hassle-free
              for individuals, businesses, and freelancers.
            </p>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-muted p-1 rounded-lg w-full sm:w-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                      activeTab === tab.id
                        ? "bg-white text-[#15803d] shadow-sm dark:bg-slate-800 dark:text-white"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                {activeTab === "individuals" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
                    Easy NTN registration, simplified tax filing, and wealth statement preparation for salaried
                    individuals, property owners, and investors.
                  </motion.p>
                )}
                {activeTab === "businesses" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
                    Complete business tax solutions including company registration, sales tax, corporate compliance, and
                    SECP filings.
                  </motion.p>
                )}
                {activeTab === "freelancers" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
                    Specialized tax services for freelancers and gig workers, with expert guidance on expense deductions
                    and tax planning.
                  </motion.p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-[#15803d] hover:bg-[#126430] w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border">
              <Image
                src="https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Tax filing made simple"
                width={700}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6">
                  <p className="text-white font-medium">Trusted by thousands of taxpayers across Pakistan</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div
              className="absolute -bottom-6 -right-6 w-64 h-64 bg-[#15803d]/10 rounded-full -z-10 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="absolute -top-6 -left-6 w-32 h-32 bg-[#15803d]/10 rounded-full -z-10 blur-xl"
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
