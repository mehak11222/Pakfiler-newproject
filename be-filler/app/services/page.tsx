import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, UserPlus, BarChart4, Building2, Scale, Award, ArrowRight } from "lucide-react"
import { taxServices } from "@/lib/constants"

export default function ServicesPage() {
  return (
    <main className="container mx-auto px-4 py-16 mt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Our Services</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive tax solutions for individuals and businesses in Pakistan. From simple tax returns to complex
          compliance matters, we've got you covered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {taxServices.map((service, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-[#15803d]/10 rounded-lg flex items-center justify-center mb-4">
                {service.icon === "File" && <FileText className="w-6 h-6 text-[#15803d]" />}
                {service.icon === "ClipboardCheck" && <UserPlus className="w-6 h-6 text-[#15803d]" />}
                {service.icon === "BarChart4" && <BarChart4 className="w-6 h-6 text-[#15803d]" />}
                {service.icon === "Building2" && <Building2 className="w-6 h-6 text-[#15803d]" />}
                {service.icon === "Lightbulb" && <Scale className="w-6 h-6 text-[#15803d]" />}
                {service.icon === "Award" && <Award className="w-6 h-6 text-[#15803d]" />}
              </div>
              <CardTitle className="text-xl">{service.title}</CardTitle>
              <CardDescription className="mt-2">{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={service.link}>
                <Button variant="outline" className="w-full text-[#15803d] hover:text-[#15803d] hover:bg-[#15803d]/5">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-[#15803d]/5 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need Help Choosing a Service?</h2>
        <p className="text-muted-foreground mb-6">
          Our tax experts are here to help you select the right services for your needs.
        </p>
        <Link href="/contact">
          <Button className="bg-[#15803d] hover:bg-[#11632a]">
            Contact Us <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </main>
  )
}
