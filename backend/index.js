import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { connectDB } from "./src/config/db.js"
import { EventEmitter } from "events"
EventEmitter.defaultMaxListeners = 20

// Import Routes
import authRoutes from "./src/routes/auth.routes.js"
import userRoutes from "./src/routes/user.routes.js"
import taxRoutes from "./src/routes/tax.routes.js"
import serviceRoutes from "./src/routes/service.route.js"
import personalInfoRouter from "./src/routes/personalInfo.routes.js"
import incomeSourcesRoutes from "./src/routes/incomeSources.routes.js"
import taxCreditRoutes from "./src/routes/taxCredits/taxCredits.routes.js"
import taxFilingRoutes from "./src/routes/taxFilling/taxFiling.Routes.js"
import filingStepsRoutes from "./src/routes/Filing/filingSteps.routes.js";




// Income Modules
import agricultureRoutes from "./src/routes/incomeDetails/agriculture.routes.js"
import businessIncomeRoutes from "./src/routes/incomeDetails/businessIncome.routes.js"
import commissionServiceIncomeRoutes from "./src/routes/incomeDetails/commission.routes.js"
import dividendRoutes from "./src/routes/incomeDetails/dividend.routes.js"
import freelancerRoutes from "./src/routes/incomeDetails/freelancerIncome.routes.js"
import otherIncomeRoutes from "./src/routes/incomeDetails/otherincome.routes.js"
import partnershipRoutes from "./src/routes/incomeDetails/partnership.routes.js"
import professionalServicesRoutes from "./src/routes/incomeDetails/professionalServices.routes.js"
import profitOnSavingsRoutes from "./src/routes/incomeDetails/profitOnSavings.routes.js"
import propertySaleIncomeRoutes from "./src/routes/incomeDetails/propertysale.routes.js"
import rentRoutes from "./src/routes/incomeDetails/rent.routes.js"
import salaryIncomeRoutes from "./src/routes/incomeDetails/salaryIncome.routes.js"

import incomeSummaryRoute from "./src/routes/incomeDetails/incomeSummaryRoute.js"

// Deductions
import bankTransactionRoutes from "./src/routes/deduction/bankTransaction.routes.js"
import vehicleDeductionRoutes from "./src/routes/deduction/vehicleDeduction.routes.js"
import utilityDeductionRoutes from "./src/routes/deduction/utilityDeduction.routes.js"
import otherDeductionRoutes from "./src/routes/deduction/otherDeduction.routes.js"

// Assets & Wealth
import openingWealthRoutes from "./src/routes/openingWealth/openingWealth.routes.js"
import assetSelectionRoutes from "./src/routes/assetSelection/assetSelection.routes.js"
import propertyAssetRoutes from "./src/routes/assetDetails/propertyAsset.routes.js"
import vehicleRoutes from "./src/routes/assetDetails/vehicle.routes.js"
import bankAccountRoutes from "./src/routes/assetDetails/bankAccount.routes.js"
import insuranceRoutes from "./src/routes/assetDetails/insurance.routes.js"
import cashRoutes from "./src/routes/assetDetails/cash.routes.js"
import possessionRoutes from "./src/routes/assetDetails/possession.routes.js"
import foreignAssetRoutes from "./src/routes/assetDetails/foreignAsset.routes.js"
import otherAssetRoutes from "./src/routes/assetDetails/otherAsset.routes.js"

// Liabilities & Expense
import bankLoanRoutes from "./src/routes/bankLoan/bankLoan.routes.js"
import otherLiabilityRoutes from "./src/routes/bankLoan/otherLiability.routes.js"
import expenseRoutes from "./src/routes/expense/expense.routes.js"

// Final Tax & Add-ons
import taxFinalizationRoutes from "./src/routes/taxFinalization/taxFinalization.routes.js"
import familyRoutes from "./src/routes/FamilyTaxFilling/familyAccount.routes.js"
import irisProfileRoutes from "./src/routes/irisProfile/irisProfile.routes.js"
import ntnRoutes from "./src/routes/ntnRegistration/ntn.routes.js"

// Business Incorporation
import businessIncorporationRoutes from "./src/routes/businessIncorporation/businessIncorporation.routes.js"

// GST
import gstRoutes from "./src/routes/gst/gst.routes.js"

// Summary Routes
// import incomeSummaryRoute from "./src/routes/incomeDetails/incomeSummaryRoute.js"
import deductionRoutes from "./src/routes/deduction/deductionRoutes.js"
import assetSummaryRoutes from "./src/routes/assetDetails/assetSummary.routes.js"
import documentSummaryRoute from "./src/routes/documentSummary/documentRoutes.js"

import serviceChargeRoutes from "./src/routes/ServiceCharge/serviceCharge.routes.js"

// Admin Routes
import adminDocumentRoutes from "./src/routes/admin/adminDocument.routes.js"
import adminTaxFilingRoutes from "./src/routes/admin/adminTaxFiling.routes.js"

// ✅ NEW: Comprehensive Data Routes
import comprehensiveDataRoutes from "./src/routes/comprehensive/comprehensiveData.routes.js"
import bulkOperationsRoutes from "./src/routes/comprehensive/bulkOperations.routes.js"
import comprehensiveTaxFilingRoutes from "./src/routes/Filing/comprehensiveTaxFiling.routes.js"

import wrapupRoutes from "./src/routes/wrapUp/wrapup.routes.js"
import paymentProofRoutes from "./src/routes/payment/paymentProof.routes.js"

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'https://your-frontend-domain.vercel.app'],
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json({ limit: "50mb" })) // Increased limit for bulk operations
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Database
connectDB()

// Serve Uploaded Files
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")))

// Public API Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/service", serviceRoutes)

// Tax
app.use("/api/tax-filing", taxRoutes)
app.use("/api/tax", taxFinalizationRoutes)
app.use("/api/tax-credit", taxCreditRoutes)

// Personal Info & Income Sources
app.use("/api/personal-info", personalInfoRouter)
app.use("/api/income-sources", incomeSourcesRoutes)

// Income
app.use("/api/income", agricultureRoutes)
app.use("/api/income", businessIncomeRoutes)
app.use("/api/income", commissionServiceIncomeRoutes)
app.use("/api/income", dividendRoutes)
app.use("/api/income", freelancerRoutes)
app.use("/api/income", otherIncomeRoutes)
app.use("/api/income", partnershipRoutes)
app.use("/api/income", professionalServicesRoutes)
app.use("/api/income", profitOnSavingsRoutes)
app.use("/api/income", propertySaleIncomeRoutes)
app.use("/api/income", rentRoutes)
app.use("/api/income", salaryIncomeRoutes)

app.use("/api/income", incomeSummaryRoute)

// Deductions
app.use("/api/deduction", bankTransactionRoutes)
app.use("/api/deduction", vehicleDeductionRoutes)
app.use("/api/deduction", utilityDeductionRoutes)
app.use("/api/deduction", otherDeductionRoutes)

// Assets
app.use("/api/wealth", openingWealthRoutes)
app.use("/api/wealth", assetSelectionRoutes)
app.use("/api/assets", propertyAssetRoutes)
app.use("/api/assets", vehicleRoutes)
app.use("/api/assets", bankAccountRoutes)
app.use("/api/assets", insuranceRoutes)
app.use("/api/assets", cashRoutes)
app.use("/api/assets", possessionRoutes)
app.use("/api/assets", foreignAssetRoutes)
app.use("/api/assets", otherAssetRoutes)

// Liabilities & Expenses
app.use("/api/liabilities", bankLoanRoutes)
app.use("/api/liabilities", otherLiabilityRoutes)
app.use("/api/expense", expenseRoutes)

// Family Tax Filing
app.use("/api/family-account", familyRoutes)

// IRIS and NTN
app.use("/api/iris-profile", irisProfileRoutes)
app.use("/api/ntn", ntnRoutes)

// Business Incorporation
app.use("/api/business-incorporation", businessIncorporationRoutes)

// GST
app.use("/api/gst", gstRoutes)

app.use("/api/tax-filings", taxFilingRoutes)

// Admin Routes
app.use("/api/admin/documents", adminDocumentRoutes)
app.use("/api/admin/tax-filings", adminTaxFilingRoutes)

// Summary Routes
app.use("/api/income", incomeSummaryRoute)
app.use("/api/deduction", deductionRoutes)
app.use("/api/assets", assetSummaryRoutes)
app.use("/api/documents", documentSummaryRoute)

app.use("/api/service-charge", serviceChargeRoutes)

// ✅ NEW: Comprehensive Data Management Routes
app.use("/api/comprehensive", comprehensiveDataRoutes)
app.use("/api/comprehensive/bulk", bulkOperationsRoutes)

app.use("/api/wrapup", wrapupRoutes)

app.use("/api/tax-filing/comprehensive", comprehensiveTaxFilingRoutes)
app.use("/api/tax-filing", paymentProofRoutes)
app.use("/api/filing-steps", filingStepsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
