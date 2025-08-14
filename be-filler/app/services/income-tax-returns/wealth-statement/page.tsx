"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, FileText, Calculator, CheckCircle, Home, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function WealthStatementPage() {
  const components = {
    assets: [
      "Real estate and properties",
      "Bank accounts and cash",
      "Investments and securities",
      "Vehicles and other assets",
      "Business capital and ownership",
      "Jewelry and valuables",
    ],
    liabilities: [
      "Loans and mortgages",
      "Credit card debts",
      "Business liabilities",
      "Personal borrowings",
      "Unpaid taxes",
      "Other financial obligations",
    ],
    expenses: [
      "Personal and household expenses",
      "Education expenses",
      "Travel and vehicle expenses",
      "Utility bills and services",
      "Medical and insurance costs",
      "Other significant expenditures",
    ],
  }

  const process = [
    {
      title: "Asset Documentation",
      description: "Gather and document all your assets and their values",
      icon: Home,
    },
    {
      title: "Liability Reporting",
      description: "Report all loans, debts and financial obligations",
      icon: CreditCard,
    },
    {
      title: "Expense Reconciliation",
      description: "Reconcile your personal and household expenses",
      icon: Calculator,
    },
    {
      title: "Verification & Submission",
      description: "Review and submit your complete wealth statement",
      icon: CheckCircle,
    },
  ]

  return (
    <main className="container mx-auto px-4 py-16 mt-16">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Wealth Statement</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The second component of your Income Tax Return. Declare your assets, liabilities, and expenses with our
            comprehensive wealth statement filing service. Expert guidance ensures accurate and compliant reporting.
          </p>
          <div className="flex gap-4">
            <Link href="/auth/signup">
              <Button className="bg-[#af0e0e] hover:bg-[#8a0b0b]">
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
            src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg"
            alt="Wealth Statement"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Wealth Statement Components</h2>
        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          {Object.entries(components).map(([key, componentList]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{key.charAt(0).toUpperCase() + key.slice(1)} Declaration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {componentList.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-[#af0e0e]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Process Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {process.map((step, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#af0e0e]/10 rounded-lg flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-[#af0e0e]" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-16 bg-card p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Benefits of Our Wealth Statement Service</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-background">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Accuracy Assurance</h3>
              <p className="text-muted-foreground">
                Our experts ensure all assets and liabilities are accurately reported, minimizing audit risks.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Simplified Process</h3>
              <p className="text-muted-foreground">
                Our step-by-step guidance makes complex wealth reporting straightforward and manageable.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Compliance Guarantee</h3>
              <p className="text-muted-foreground">
                We ensure your wealth statement meets all FBR requirements and regulations.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Document Management</h3>
              <p className="text-muted-foreground">
                Secure storage and organization of all supporting documents for future reference.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Expert Consultation</h3>
              <p className="text-muted-foreground">
                Get personalized advice on optimizing your wealth declaration and financial planning.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Peace of Mind</h3>
              <p className="text-muted-foreground">
                Rest easy knowing your wealth statement is complete, accurate, and compliant.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Component Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Complete Your Income Tax Return</h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-8">
          Remember, a complete Income Tax Return requires both the Tax Filing and Wealth Statement components. Make sure
          to complete both for full compliance.
        </p>

        <Card className="bg-card border-2 border-[#af0e0e]/20">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#af0e0e]/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-[#af0e0e]" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">Tax Filing</h3>
                  <p className="text-muted-foreground">The first essential component of your Income Tax Return</p>
                </div>
              </div>
              <Link href="/services/income-tax-returns/tax-filing">
                <Button className="bg-[#af0e0e] hover:bg-[#8a0b0b]">
                  Learn About Tax Filing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Who needs to file a wealth statement?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All taxpayers with an income above the threshold set by FBR must file a wealth statement along with
                their income tax return. This includes salaried individuals, business owners, and professionals.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What documents do I need for my wealth statement?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You'll need property documents, bank statements, investment certificates, vehicle registration papers,
                loan agreements, credit card statements, and records of major expenses.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I file a wealth statement separately from my tax return?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No, the wealth statement is an integral part of the income tax return and must be filed together. Our
                service ensures both components are properly completed and submitted.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What happens if I make a mistake in my wealth statement?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Errors in your wealth statement can trigger FBR scrutiny. Our expert review process helps identify and
                correct potential issues before submission, reducing audit risks.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#af0e0e]/5 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Complete Your Wealth Statement?</h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of satisfied customers who trust Pakfiler with their wealth statement filing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup">
            <Button className="bg-[#af0e0e] hover:bg-[#8a0b0b]">
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
