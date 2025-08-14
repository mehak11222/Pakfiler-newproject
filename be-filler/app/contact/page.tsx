"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      })
      setIsSubmitting(false)
      ;(e.target as HTMLFormElement).reset()
    }, 1000)
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+92 300 1234567", "+92 21 1234567"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@pakfiler.com", "support@pakfiler.com"],
    },
    {
      icon: MapPin,
      title: "Office",
      details: ["123 Tax Avenue, Finance District", "Karachi, Pakistan"],
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Monday - Friday: 9 AM - 6 PM", "Saturday: 10 AM - 2 PM"],
    },
  ]

  return (
    <main className="container mx-auto px-4 py-16 mt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions? We're here to help. Reach out to us through any of the channels below or fill out the contact
          form.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {contactInfo.map((info, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <info.icon className="w-6 h-6 text-[#15803d]" />
                </div>
                <div>
                  <h3 className="font-semibold">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input placeholder="Full Name" required />
                </div>
                <div className="space-y-2">
                  <Input type="email" placeholder="Email Address" required />
                </div>
              </div>
              <div className="space-y-2">
                <Input placeholder="Subject" required />
              </div>
              <div className="space-y-2">
                <Textarea placeholder="Your Message" className="min-h-[150px]" required />
              </div>
              <Button type="submit" className="w-full bg-[#15803d] hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.5133634906727!2d67.0816!3d24.8606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDUxJzM4LjIiTiA2N8KwMDQnNTMuOCJF!5e0!3m2!1sen!2s!4v1635959145167!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
