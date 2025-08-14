export const taxServices = [
  {
    id: 1,
    title: "Income Tax Returns",
    description: "Complete income tax return filing including tax filing and wealth statement",
    icon: "File",
    link: "/services/income-tax-returns",
  },
  {
    id: 2,
    title: "Tax Registration",
    description: "Get registered with FBR and obtain your NTN",
    icon: "ClipboardCheck",
    link: "/services/tax-registration",
  },
  {
    id: 4,
    title: "Corporate Services",
    description: "Company registration, SECP compliance & sales tax registration",
    icon: "Building2",
    link: "/services/corporate",
  },
  {
    id: 5,
    title: "Compliance Advisory",
    description: "Expert advice on tax compliance and FBR regulations",
    icon: "Lightbulb",
    link: "/services/compliance",
  },
  {
    id: 6,
    title: "Certificate Issuance",
    description: "Active taxpayer certificates and other documentation",
    icon: "Award",
    link: "/services/certificate-issuance",
  },
]

export const testimonials = [
  {
    id: 1,
    name: "Ali Ahmed",
    title: "Business Owner",
    content:
      "Pakfiler has made tax filing so much easier for my business. The interface is intuitive and the customer support is excellent!",
    rating: 5,
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: 2,
    name: "Sarah Khan",
    title: "Freelance Developer",
    content:
      "As a freelancer, I was always confused about tax filing. Pakfiler simplified the entire process for me. Highly recommended!",
    rating: 5,
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: 3,
    name: "Rizwan Malik",
    title: "Corporate Executive",
    content:
      "Our company has been using Pakfiler for tax compliance for the past 2 years. Their service is top-notch and always up-to-date with the latest regulations.",
    rating: 4,
    avatar:
      "https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: 4,
    name: "Fatima Zaidi",
    title: "Finance Professional",
    content:
      "The wealth statement feature is extremely detailed and accurate. Pakfiler has made tax season stress-free for me and my clients.",
    rating: 5,
    avatar:
      "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
]

export const faqItems = [
  {
    question: "How do I register for tax filing?",
    answer:
      "You can register by clicking on the Sign Up button, providing your email, and completing the registration process. You'll receive a verification email to confirm your account.",
  },
  {
    question: "What documents do I need for filing my tax return?",
    answer:
      "You'll need your CNIC, details of your income sources, bank statements, property documents (if applicable), investment details, and information about any assets you own.",
  },
  {
    question: "How long does it take to file a tax return through Pakfiler?",
    answer:
      "Once you've gathered all the necessary documents, filing a tax return through our platform usually takes 30-45 minutes for individuals and slightly longer for businesses.",
  },
  {
    question: "Can I file for previous years' taxes?",
    answer:
      "Yes, Pakfiler supports filing tax returns for previous years. You can select the specific tax year during the filing process.",
  },
  {
    question: "What if I receive a notice from FBR after filing?",
    answer:
      "Our compliance team provides assistance with responding to notices. You can upload the notice in your dashboard and our experts will guide you through the response process.",
  },
  {
    question: "Is my data secure with Pakfiler?",
    answer:
      "Yes, we use industry-standard encryption and security measures to protect all your data. Your information is never shared with third parties without your consent.",
  },
]

export const userRoles = ["user", "admin", "accountant"]

export const countryCodes = [
  { code: "+92", country: "Pakistan" },
  { code: "+91", country: "India" },
  { code: "+1", country: "United States" },
  { code: "+44", country: "United Kingdom" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+60", country: "Malaysia" },
  { code: "+65", country: "Singapore" },
  { code: "+61", country: "Australia" },
  { code: "+49", country: "Germany" },
]

export const mockTaxReturns = [
  {
    id: "TR-001",
    taxYear: "2022-2023",
    filingDate: "2023-09-15",
    status: "Completed",
    taxAmount: 45000,
    refundAmount: 0,
  },
  {
    id: "TR-002",
    taxYear: "2021-2022",
    filingDate: "2022-09-20",
    status: "Completed",
    taxAmount: 38500,
    refundAmount: 2000,
  },
  {
    id: "TR-003",
    taxYear: "2020-2021",
    filingDate: "2021-09-12",
    status: "Completed",
    taxAmount: 32000,
    refundAmount: 0,
  },
]

export const mockWealthStatements = [
  {
    id: "WS-001",
    taxYear: "2022-2023",
    filingDate: "2023-09-25",
    status: "Completed",
    totalAssets: 15000000,
    totalLiabilities: 3000000,
  },
  {
    id: "WS-002",
    taxYear: "2021-2022",
    filingDate: "2022-09-28",
    status: "Completed",
    totalAssets: 12500000,
    totalLiabilities: 2800000,
  },
]

export const mockNotifications = [
  {
    id: "N-001",
    title: "Tax Filing Deadline Approaching",
    message: "The deadline for filing tax returns for the year 2022-2023 is September 30, 2023.",
    date: "2023-09-01",
    read: false,
  },
  {
    id: "N-002",
    title: "Document Verification Complete",
    message: "Your documents for wealth statement WS-001 have been verified successfully.",
    date: "2023-09-15",
    read: true,
  },
  {
    id: "N-003",
    title: "New Tax Advisory Available",
    message: "Check out our latest tax advisory on the recent changes in FBR regulations.",
    date: "2023-08-25",
    read: false,
  },
]

export const mockAdminUsers = [
  {
    id: "U-001",
    name: "Ahmed Ali",
    email: "ahmed@example.com",
    role: "user",
    registrationDate: "2023-01-15",
    status: "Active",
    filings: 3,
  },
  {
    id: "U-002",
    name: "Sara Khan",
    email: "sara@example.com",
    role: "user",
    registrationDate: "2023-02-22",
    status: "Active",
    filings: 2,
  },
  {
    id: "U-003",
    name: "Fahad Malik",
    email: "fahad@example.com",
    role: "accountant",
    registrationDate: "2023-03-10",
    status: "Active",
    filings: 0,
  },
  {
    id: "U-004",
    name: "Ayesha Siddiqui",
    email: "ayesha@example.com",
    role: "user",
    registrationDate: "2023-04-05",
    status: "Inactive",
    filings: 1,
  },
  {
    id: "U-005",
    name: "Zain Ahmed",
    email: "zain@example.com",
    role: "admin",
    registrationDate: "2022-12-01",
    status: "Active",
    filings: 0,
  },
]

export const mockRecentFilers = [
  {
    id: "RF-001",
    user: "Ahmed Ali",
    taxYear: "2022-2023",
    filingDate: "2023-09-15",
    taxAmount: 45000,
    status: "Completed",
  },
  {
    id: "RF-002",
    user: "Sara Khan",
    taxYear: "2022-2023",
    filingDate: "2023-09-14",
    taxAmount: 32000,
    status: "Completed",
  },
  {
    id: "RF-003",
    user: "Ayesha Siddiqui",
    taxYear: "2022-2023",
    filingDate: "2023-09-10",
    taxAmount: 28500,
    status: "Under Review",
  },
]

export const mockAccountantClients = [
  {
    id: "C-001",
    name: "Ahmed Ali",
    email: "ahmed@example.com",
    filings: 3,
    latestFiling: "2023-09-15",
    status: "Completed",
  },
  {
    id: "C-002",
    name: "Sara Khan",
    email: "sara@example.com",
    filings: 2,
    latestFiling: "2023-09-14",
    status: "Completed",
  },
  {
    id: "C-003",
    name: "Ayesha Siddiqui",
    email: "ayesha@example.com",
    filings: 1,
    latestFiling: "2023-09-10",
    status: "Under Review",
  },
  {
    id: "C-004",
    name: "Bilal Hassan",
    email: "bilal@example.com",
    filings: 0,
    latestFiling: "-",
    status: "Not Started",
  },
]

export const mockMonthlyFilings = [
  { month: "Jan", filings: 45 },
  { month: "Feb", filings: 52 },
  { month: "Mar", filings: 48 },
  { month: "Apr", filings: 70 },
  { month: "May", filings: 120 },
  { month: "Jun", filings: 160 },
  { month: "Jul", filings: 180 },
  { month: "Aug", filings: 220 },
  { month: "Sep", filings: 300 },
  { month: "Oct", filings: 95 },
  { month: "Nov", filings: 68 },
  { month: "Dec", filings: 85 },
]

export const mockRevenueData = [
  { month: "Jan", revenue: 150000 },
  { month: "Feb", revenue: 175000 },
  { month: "Mar", revenue: 160000 },
  { month: "Apr", revenue: 200000 },
  { month: "May", revenue: 320000 },
  { month: "Jun", revenue: 480000 },
  { month: "Jul", revenue: 520000 },
  { month: "Aug", revenue: 620000 },
  { month: "Sep", revenue: 820000 },
  { month: "Oct", revenue: 350000 },
  { month: "Nov", revenue: 250000 },
  { month: "Dec", revenue: 280000 },
]
