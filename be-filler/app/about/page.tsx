import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Users, Trophy, Target } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { label: "Happy Clients", value: "10,000+", icon: Users },
    { label: "Tax Returns Filed", value: "50,000+", icon: CheckCircle },
    { label: "Years of Experience", value: "5+", icon: Trophy },
    { label: "Success Rate", value: "99%", icon: Target },
  ]

  const values = [
    {
      title: "Simplicity",
      description: "Making tax filing accessible and understandable for everyone.",
    },
    {
      title: "Accuracy",
      description: "Ensuring precise calculations and compliance with tax regulations.",
    },
    {
      title: "Transparency",
      description: "Clear communication and no hidden fees throughout the process.",
    },
    {
      title: "Support",
      description: "Dedicated customer service to assist you every step of the way.",
    },
  ]

  return (
    <main className="container mx-auto px-4 py-16 mt-16">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Pakistan's Leading Tax Filing Platform</h1>
          <p className="text-lg text-muted-foreground mb-8">
            At Pakfiler, we're committed to simplifying tax compliance for individuals and businesses across Pakistan.
            Our platform combines technology with expertise to make tax filing accessible, affordable, and hassle-free.
          </p>
          <Link href="/auth/signup">
            <Button className="bg-[#15803d] hover:bg-green-700">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="lg:w-1/2">
          <Image
            src="https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg"
            alt="Team meeting"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-[#15803d]" />
              </div>
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Values Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Values</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          These core values guide everything we do at Pakfiler, ensuring we deliver the best possible service to our
          clients.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of satisfied customers who trust Pakfiler with their tax filing needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup">
            <Button className="bg-[#15803d] hover:bg-green-700">
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
