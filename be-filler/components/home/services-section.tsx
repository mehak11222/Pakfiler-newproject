"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, File, ClipboardCheck, BarChart4, Building2, Lightbulb, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { taxServices } from "@/lib/constants"

const iconComponents = {
  File,
  ClipboardCheck,
  BarChart4,
  Building2,
  Lightbulb,
  Award,
}

const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  const IconComponent = iconComponents[service.icon as keyof typeof iconComponents]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-md transition-shadow duration-300 border border-border">
        <CardHeader>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <IconComponent className="w-6 h-6 text-[#15803d]" />
          </div>
          <CardTitle className="text-xl">{service.title}</CardTitle>
          <CardDescription>{service.description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href={service.link} className="w-full">
            <Button variant="outline" className="w-full text-[#15803d] hover:text-[#15803d] hover:bg-green-50">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

const ServicesSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-16 md:py-24 bg-card" ref={ref}>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground">
            Comprehensive tax solutions for individuals, freelancers, and businesses of all sizes. From simple tax
            returns to complex compliance matters, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taxServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/services">
            <Button size="lg" className="bg-[#15803d] hover:bg-green-700">
              View All Services <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
