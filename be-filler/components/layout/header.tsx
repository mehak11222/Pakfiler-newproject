"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { toast } from "../ui/use-toast"
import { useTranslation } from "next-i18next"
import i18n from "i18next"

import { HydrationSafeImage } from "@/components/ui/hydration-safe-image"
import { Menu, X, ChevronDown, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import AuthService from "@/auth/auth.service"

type IUser = {
  _id: string
  fullName: string
  email: string
  role: string
  cnic: string
  phone: string
  image?: string
  password?: string
  relations?: any[]
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [user, setUser] = useState<IUser | null>(null)
  const [otherAccounts, setOtherAccounts] = useState<IUser[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState("en")
  const { t } = useTranslation("common")

  useEffect(() => {
    const savedLang = typeof window !== "undefined" ? localStorage.getItem("language") : null
    if (savedLang && savedLang !== language) {
      setLanguage(savedLang)
      i18n.changeLanguage(savedLang)
    }

    const checkAuthAndFetchData = async () => {
      setLoading(true)
      try {
        const token = Cookies.get("token")

        if (token) {
          const response = await fetch("http://localhost:5000/api/auth/profile", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) throw new Error("Profile fetch failed")

          const data = await response.json()
          const userData = data.user

          setIsLoggedIn(true)
          setUserRole(userData.role)
          setUser(userData)
        } else {
          setIsLoggedIn(false)
          setUserRole(null)
          setUser(null)
        }
      } catch (error) {
        console.error("Error in auth/profile:", error)
        setIsLoggedIn(false)
        setUserRole(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    checkAuthAndFetchData()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleChangeAcc = async (email: string, password: string) => {
    const as = new AuthService()
    const result = await as.loginNoHash({ email, password })
    if (result.token) {
      toast({
        title: "Switched Dashboard",
        description: "Welcome to dashboard...",
        variant: "default",
      })
      Cookies.set("token", result.token, { sameSite: "Strict" })
      setIsLoggedIn(true)
      setUserRole(result.user.role)
      setUser(result.user)
      setIsMenuOpen(false)
      location.reload()
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    }
    router.push("/dashboard")
  }

  const handleLogOut = () => {
    Cookies.remove("token", { path: "/" })
    setIsLoggedIn(false)
    setUserRole(null)
    setUser(null)
    setOtherAccounts(null)
    setIsMenuOpen(false)
    router.push("/")
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  const serviceLinks = [
    {
      name: "Income Tax Returns",
      path: "/services/income-tax-returns",
      subServices: [
        { name: "Tax Filing", path: "/services/income-tax-returns/tax-filing" },
      ],
    },
    { name: "Tax Registration", path: "/services/tax-registration" },
    { name: "Corporate Services", path: "/services/corporate" },
    { name: "Compliance Advisory", path: "/services/compliance" },
    { name: "Certificate Issuance", path: "/services/certificate-issuance" },
  ]

  const loggedInLinks = {
    user: [{ name: "Dashboard", path: "/dashboard" }],
    admin: [{ name: "Admin Panel", path: "/dashboard/admin" }],
    accountant: [{ name: "Accounts", path: "/dashboard/accountant" }],
  }

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <HydrationSafeImage
                  src="/logo.png"
                  alt="Pakfiler Logo"
                  width={120}
                  height={40}
                  priority
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <div className="animate-pulse bg-gray-300 rounded-full h-10 w-10"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header
      className={cn("fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300", {
        "bg-background border-b shadow-sm": isScrolled,
        "bg-background": !isScrolled,
      })}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <HydrationSafeImage
                src="/logo.png"
                alt="Pakfiler Logo"
                width={120}
                height={40}
                priority
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <React.Fragment key={link.name}>
                {link.name === "Services" ? (
                  <div className="relative group">
                    <button
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent",
                        pathname?.startsWith("/services") ? "text-primary" : "text-foreground",
                      )}
                    >
                      {link.name} <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    <div className="absolute left-0 h-2 w-full"></div>
                    <div className="absolute left-0 top-full w-64 rounded-md shadow-lg py-1 bg-background border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                      {serviceLinks.map((service) => (
                        <React.Fragment key={service.name}>
                          {service.subServices ? (
                            <div className="relative group/nested">
                              <Link
                                href={service.path}
                                className="flex items-center justify-between px-4 py-2 text-sm hover:bg-accent"
                              >
                                <span>{service.name}</span>
                                <ChevronDown className="h-4 w-4" />
                              </Link>
                              <div className="absolute left-full top-0 w-48 rounded-md shadow-lg py-1 bg-background border border-border opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-150">
                                {service.subServices.map((subService) => (
                                  <Link
                                    key={subService.name}
                                    href={subService.path}
                                    className="block px-4 py-2 text-sm hover:bg-accent"
                                  >
                                    {subService.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <Link href={service.path} className="block px-4 py-2 text-sm hover:bg-accent">
                              {service.name}
                            </Link>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent",
                      pathname === link.path ? "text-primary" : "text-foreground",
                    )}
                  >
                    {link.name}
                  </Link>
                )}
              </React.Fragment>
            ))}

            {isLoggedIn && userRole && loggedInLinks[userRole as keyof typeof loggedInLinks] && (
              <>
                {loggedInLinks[userRole as keyof typeof loggedInLinks].map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent",
                      pathname === link.path ? "text-primary" : "text-foreground",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </>
            )}

            {isLoggedIn && userRole === "user" && (
              <Link
                href="/service-charges"
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent",
                  pathname === "/service-charges" ? "text-primary" : "text-foreground"
                )}
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary">
                    <AvatarImage src={user?.image || "https://via.placeholder.com/40"} alt="User Avatar" />
                    <AvatarFallback className="bg-green-500 text-white text-lg">
                      {user?.fullName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 bg-background shadow-lg rounded-lg border">
                  <div className="p-2 border-b border-border">
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>

                  {otherAccounts && otherAccounts.length > 0 && (
                    <div className="p-2">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Switch Account</p>
                      {otherAccounts.map((o: IUser, idx) => (
                        <DropdownMenuItem
                          key={o._id}
                          className="p-2 hover:bg-accent rounded-md text-sm flex justify-between items-center cursor-pointer"
                          onClick={() => handleChangeAcc(o.email, o.password || "")}
                        >
                          <span>{o.fullName}</span>
                          <span className="text-muted-foreground text-xs">
                            {user?.relations?.[idx]?.relation || "N/A"}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}

                  <DropdownMenuItem
                    onClick={handleLogOut}
                    className="p-2 hover:bg-accent rounded-md text-sm text-green-600 mt-2 cursor-pointer"
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="default" className="bg-[#15803d] hover:bg-green-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <ModeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <React.Fragment key={link.name}>
                {link.name === "Services" ? (
                  <div className="py-2">
                    <button
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-base font-medium rounded-md hover:bg-accent",
                        (pathname?.startsWith("/services")) ? "text-primary" : "text-foreground",
                      )}
                    >
                      {link.name} <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    <div className="pl-4 mt-1 space-y-1">
                      {serviceLinks.map((service) => (
                        <React.Fragment key={service.name}>
                          {service.subServices ? (
                            <>
                              <Link
                                href={service.path}
                                className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                                onClick={toggleMenu}
                              >
                                {service.name}
                              </Link>
                              <div className="pl-4 mt-1 space-y-1">
                                {service.subServices.map((subService) => (
                                  <Link
                                    key={subService.name}
                                    href={subService.path}
                                    className="block px-3 py-2 text-xs rounded-md hover:bg-accent"
                                    onClick={toggleMenu}
                                  >
                                    {subService.name}
                                  </Link>
                                ))}
                              </div>
                            </>
                          ) : (
                            <Link
                              href={service.path}
                              className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
                              onClick={toggleMenu}
                            >
                              {service.name}
                            </Link>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.path}
                    className={cn(
                      "block px-3 py-2 text-base font-medium rounded-md hover:bg-accent",
                      pathname === link.path ? "text-primary" : "text-foreground",
                    )}
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </Link>
                )}
              </React.Fragment>
            ))}

            {isLoggedIn && userRole && loggedInLinks[userRole as keyof typeof loggedInLinks] && (
              <>
                {loggedInLinks[userRole as keyof typeof loggedInLinks].map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={cn(
                      "block px-3 py-2 text-base font-medium rounded-md hover:bg-accent",
                      pathname === link.path ? "text-primary" : "text-foreground",
                    )}
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </Link>
                ))}
              </>
            )}

            {isLoggedIn && userRole === "user" && (
              <Link
                href="/service-charges"
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-md hover:bg-accent",
                  pathname === "/service-charges" ? "text-primary" : "text-foreground"
                )}
                onClick={toggleMenu}
              >
                <ShoppingCart className="h-6 w-6 mr-2 inline" /> Cart
              </Link>
            )}

            <div className="pt-4 pb-3 border-t border-border">
              {isLoggedIn && user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2">
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>

                  {otherAccounts && otherAccounts.length > 0 && (
                    <div className="space-y-1">
                      <p className="px-3 text-sm font-medium text-muted-foreground">Switch Account</p>
                      {otherAccounts.map((o: IUser, idx) => (
                        <button
                          key={o._id}
                          className="w-full px-3 py-2 text-left hover:bg-accent rounded-md flex justify-between items-center"
                          onClick={() => handleChangeAcc(o.email, o.password || "")}
                        >
                          <span>{o.fullName}</span>
                          <span className="text-muted-foreground text-xs">
                            {user?.relations?.[idx]?.relation || "N/A"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={handleLogOut}
                    className="w-full px-3 py-2 text-left text-green-600 hover:bg-accent rounded-md"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/auth/login" className="w-full" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="w-full" onClick={toggleMenu}>
                    <Button variant="default" className="w-full bg-[#15803d] hover:bg-green-700">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header