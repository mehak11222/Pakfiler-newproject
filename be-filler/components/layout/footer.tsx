import Link from "next/link"
import { HydrationSafeImage } from "@/components/ui/hydration-safe-image"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-card pt-12 border-t">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          <div className="space-y-4">
            <Link href="/">
              <HydrationSafeImage
                src="/logo.png"
                alt="Pakfiler Logo"
                width={150}
                height={70}
                className="h-[70px] w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm mt-4">
              Simplified tax filing, registration, and compliance services in Pakistan. Making tax filing easy,
              affordable and hassle-free.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="text-muted-foreground hover:text-[#15803d] transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="text-muted-foreground hover:text-[#15803d] transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                className="text-muted-foreground hover:text-[#15803d] transition-colors"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="text-muted-foreground hover:text-[#15803d] transition-colors"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/tax-filing"
                  className="text-muted-foreground hover:text-[#15803d] text-sm transition-colors"
                >
                  Tax Filing
                </Link>
              </li>
              <li>
                <Link
                  href="/services/tax-registration"
                  className="text-muted-foreground hover:text-[#15803d] text-sm transition-colors"
                >
                  Tax Registration
                </Link>
              </li>
              <li>
                <Link
                  href="/services/income-tax-returns/wealth-statement"
                  className="text-muted-foreground hover:text-[#15803d] text-sm transition-colors"
                >
                  Wealth Statement
                </Link>
              </li>
              <li>
                <Link
                  href="/services/corporate"
                  className="text-muted-foreground hover:text-[#15803d] text-sm transition-colors"
                >
                  Corporate Services
                </Link>
              </li>
              <li>
                <Link
                  href="/services/compliance"
                  className="text-muted-foreground hover:text-[#15803d] text-sm transition-colors"
                >
                  Compliance Advisory
                </Link>
              </li>
              <li>
                <Link
                  href="/services/certificate-issuance"
                  className="text-muted-foreground hover:text-[#15803d] text-sm transition-colors"
                >
                  Certificate Issuance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-[#15803d] text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-[#15803d] text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-[#15803d] text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-[#15803d] text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-[#15803d] text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-muted-foreground hover:text-[#15803d] text-sm transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-[#15803d] mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 Tax Avenue, Finance District, Karachi, Pakistan
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-[#15803d]" />
                <span className="text-sm text-muted-foreground">+92 300 1234567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-[#15803d]" />
                <span className="text-sm text-muted-foreground">info@pakfiler.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Pakfiler. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-xs text-muted-foreground hover:text-[#15803d] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-xs text-muted-foreground hover:text-[#15803d] transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
