"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, FileCheck, FileText, Clock, Shield, Award } from "lucide-react"

export default function CertificateIssuancePage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-900 to-green-700 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">Certificate Issuance Services</h1>
              <p className="text-lg mb-8 text-gray-100">
                Obtain essential business certificates and documentation with our streamlined, hassle-free certificate
                issuance services.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#15803d] hover:bg-[#11632a]">
                  Request Certificate <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="text-black border-white hover:text-[#15803d] hover:border-[#15803d] hover:bg-white">
                  View Certificate Types
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Certificate Issuance"
                width={500}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Certificate Types */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Certificate Types</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer a comprehensive range of certificates to meet your business and personal needs.
            </p>
          </motion.div>

          <Tabs defaultValue="business" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8">
              <TabsTrigger value="business" className="text-sm md:text-base">
                Business Certificates
              </TabsTrigger>
              <TabsTrigger value="tax" className="text-sm md:text-base">
                Tax Certificates
              </TabsTrigger>
              <TabsTrigger value="legal" className="text-sm md:text-base">
                Legal Certificates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="business" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-6 w-6 text-green-700" />
                    Business Certificates
                  </CardTitle>
                  <CardDescription>Essential certificates for business operations and compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Available Certificates:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Certificate of Incorporation</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Good Standing Certificate</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Business Registration Certificate</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Chamber of Commerce Certificate</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Industry-Specific Certifications</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Benefits:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Establish business credibility</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Meet regulatory requirements</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Access business opportunities</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Facilitate business transactions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Support loan and funding applications</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tax" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileCheck className="mr-2 h-6 w-6 text-green-700" />
                    Tax Certificates
                  </CardTitle>
                  <CardDescription>Tax-related certificates for compliance and verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Available Tax Certificates:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Tax Registration Certificate</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Tax Clearance Certificate</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Sales Tax Registration Certificate</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Income Tax Certificate</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Withholding Tax Exemption Certificate</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Key Features:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Verification of tax compliance</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Prevention of tax penalties</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Support for government tenders</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Required for business transactions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Proof of tax status for stakeholders</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legal" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-6 w-6 text-green-700" />
                    Legal Certificates
                  </CardTitle>
                  <CardDescription>Legal documentation and certificates for various purposes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Legal Certificate Types:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Share Certificate</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Directorship Certificate</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Memorandum & Articles Certificate</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Compliance Certificate</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Legal Entity Identifier Certificate</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Applications:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Corporate governance documentation</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Proof of ownership</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Legal compliance verification</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>International business transactions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Regulatory submissions</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Certificate Issuance Process</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our streamlined process ensures quick and hassle-free certificate issuance
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <FileText className="h-10 w-10 text-green-700" />,
                title: "Submit Request",
                description: "Fill out our simple online form specifying the certificate type you need.",
              },
              {
                icon: <Shield className="h-10 w-10 text-green-700" />,
                title: "Document Verification",
                description: "Our team verifies your information and required documentation.",
              },
              {
                icon: <FileCheck className="h-10 w-10 text-green-700" />,
                title: "Certificate Processing",
                description: "We process your request with the relevant authorities and prepare your certificate.",
              },
              {
                icon: <Award className="h-10 w-10 text-green-700" />,
                title: "Certificate Delivery",
                description: "Receive your certificate digitally or in physical form as per your preference.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-green-50 rounded-full">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Certificate Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the advantages of our professional certificate issuance services
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Clock className="h-10 w-10 text-green-700" />,
                title: "Fast Turnaround",
                description: "Get your certificates issued quickly with our expedited processing options.",
              },
              {
                icon: <Shield className="h-10 w-10 text-green-700" />,
                title: "100% Accuracy",
                description: "Our expert team ensures all certificates are accurate and compliant with regulations.",
              },
              {
                icon: <FileCheck className="h-10 w-10 text-green-700" />,
                title: "End-to-End Support",
                description: "We handle the entire process from application to delivery, saving you time and effort.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-green-50 rounded-full">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our certificate issuance services
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  How long does it take to get a certificate issued?
                </AccordionTrigger>
                <AccordionContent>
                  The processing time varies depending on the type of certificate and the issuing authority. Most
                  business certificates can be processed within 3-5 working days, while some tax certificates may take
                  7-10 working days. We also offer expedited services for urgent requirements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  What documents are required for certificate issuance?
                </AccordionTrigger>
                <AccordionContent>
                  Required documentation varies by certificate type. Generally, you'll need to provide business
                  registration documents, identification proof, and specific forms related to the certificate you're
                  requesting. Our team will guide you through the exact requirements after you submit your initial
                  request.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">Can you help with certificate renewals?</AccordionTrigger>
                <AccordionContent>
                  Yes, we provide certificate renewal services for all types of certificates we issue. We can set up
                  automatic reminders for upcoming renewals to ensure your certificates remain valid and you stay
                  compliant with regulatory requirements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  Do you provide digital certificates or only physical copies?
                </AccordionTrigger>
                <AccordionContent>
                  We provide both digital and physical certificates based on your preference and the requirements of the
                  certificate type. Digital certificates are delivered via email and can be accessed through our secure
                  client portal, while physical certificates can be delivered to your address or collected from our
                  office.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">Are your certificates legally recognized?</AccordionTrigger>
                <AccordionContent>
                  Yes, all certificates issued through our service are legally recognized and comply with the relevant
                  regulatory requirements. We work directly with official government bodies and authorized agencies to
                  ensure the authenticity and validity of all certificates.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-900 to-green-700 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Get Your Certificate?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Start the certificate issuance process today and experience our efficient, hassle-free service.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-[#15803d] hover:bg-[#11632a]">Request a Certificate</Button>
              <Button variant="outline" className="text-black border-white hover:text-[#15803d] hover:border-[#15803d] hover:bg-white">
                Contact Our Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
