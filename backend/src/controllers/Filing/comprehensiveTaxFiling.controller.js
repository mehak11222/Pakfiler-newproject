import mongoose from "mongoose"
import TaxFiling from "../../models/TaxFiling/TaxFiling.js"
import PersonalInfo from "../../models/PersonalInfo.js"
import IncomeSources from "../../models/incomeSources.model.js"
import SalaryIncome from "../../models/incomeDetails/salaryIncome.model.js"
import BusinessIncome from "../../models/incomeDetails/businessIncome.model.js"
import FreelancerIncome from "../../models/incomeDetails/freelancerIncome.model.js"
import ProfessionalServicesIncome from "../../models/incomeDetails/professionalServices.model.js"
import AgricultureIncome from "../../models/incomeDetails/agriculture.js"
import CommissionServiceIncome from "../../models/incomeDetails/commission.js"
import PartnershipAOPIncome from "../../models/incomeDetails/partnership.js"
import RentIncome from "../../models/incomeDetails/rent.js"
import PropertySaleIncome from "../../models/incomeDetails/propertySale.js"
import ProfitOnSavings from "../../models/incomeDetails/profitOnSavings.model.js"
import DividendCapitalGainIncome from "../../models/incomeDetails/dividend.js"
import OtherIncome from "../../models/incomeDetails/otherIncome.js"
import TaxCredit from "../../models/taxCredits/taxCredits.js"
import OpeningWealth from "../../models/openingWealth/openingWealth.model.js"
import AssetSelection from "../../models/assetSelection/assetSelection.model.js"
import PropertyAsset from "../../models/assetDetails/propertyAsset.model.js"
import VehicleAsset from "../../models/assetDetails/vehicle.model.js"
import BankAccountAsset from "../../models/assetDetails/bankAccount.model.js"
import InsuranceAsset from "../../models/assetDetails/insurance.model.js"
import CashAsset from "../../models/assetDetails/cash.model.js"
import PossessionAsset from "../../models/assetDetails/possession.model.js"
import ForeignAsset from "../../models/assetDetails/foreignAsset.model.js"
import OtherAsset from "../../models/assetDetails/otherAsset.model.js"
import BankTransaction from "../../models/deduction/bankTransaction.js"
import UtilityDeduction from "../../models/deduction/utilityDeduction.js"
import VehicleDeduction from "../../models/deduction/vehicleDeduction.js"
import OtherDeduction from "../../models/deduction/otherDeduction.js"
import BankLoan from "../../models/bankLoan/bankLoan.model.js"
import OtherLiability from "../../models/bankLoan/otherLiability.model.js"
import Expense from "../../models/expense/expense.model.js"
import TaxFinalization from "../../models/taxFinalization/taxFinalization.model.js"
import { ServiceCharge } from "../../models/ServiceCharge/serviceCharge.model.js"
import User from "../../models/User.js"

// Comprehensive Tax Filing Submission API
export const submitComprehensiveTaxFiling = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const {
      // Step 1: Basic Info
      taxYear,
      filingType,

      // Step 2: Personal Information
      personalInfo,

      // Step 3: Income Sources Selection
      incomeSources,

      // Step 4-8: Income Details
      incomeDetails,

      // Step 9: Tax Credits
      taxCredits,

      // Step 10: Assets & Wealth
      openingWealth,
      assetSelection,
      assetDetails,

      // Step 11: Deductions
      deductions,

      // Step 12: Liabilities & Expenses
      liabilities,
      expenses,

      // Wrap-up & Finalization
      wrapUp,

      // Cart & Checkout
      cart,
      checkout,

      // Additional Services
      additionalServices,
    } = req.body

    const userId = req.user._id

    // Validate required fields
    if (!taxYear || !filingType) {
      return res.status(400).json({
        success: false,
        message: "Tax year and filing type are required",
      })
    }

    // Check if filing already exists
    const existingFiling = await TaxFiling.findOne({ userId, taxYear })
    if (existingFiling && existingFiling.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Tax filing for this year is already completed",
      })
    }

    let taxFiling
    const savedData = {}
    const processingSteps = []

    // Step 1: Create or Update Tax Filing Record
    processingSteps.push("Creating tax filing record")
    if (existingFiling) {
      taxFiling = existingFiling
      taxFiling.filingType = filingType
      taxFiling.status = "processing"
      // Update family info if provided
      if (personalInfo && personalInfo.family) {
        taxFiling.family = {
          spouse: personalInfo.family.spouse || false,
          children: personalInfo.family.children || 0,
        }
      } else {
        // Set default values if not provided
        taxFiling.family = {
          spouse: false,
          children: 0,
        }
      }
      await taxFiling.save({ session })
    } else {
      taxFiling = new TaxFiling({
        userId,
        taxYear,
        filingType,
        status: "processing",
        personalInfo: {
          fullName: personalInfo?.fullName || "Not provided",
        },
        family: {
          spouse: personalInfo?.family?.spouse || false,
          children: personalInfo?.family?.children || 0,
        },
      })
      await taxFiling.save({ session })
    }

    // Step 2: Save Personal Information
    if (personalInfo) {
      processingSteps.push("Saving personal information")
      const personalInfoRecord = await PersonalInfo.findOneAndUpdate(
        { filingId: taxFiling._id },
        {
          ...personalInfo,
          filingId: taxFiling._id,
        },
        { upsert: true, new: true, session },
      )
      savedData.personalInfo = personalInfoRecord
    }

    // Step 3: Save Income Sources
    if (incomeSources) {
      processingSteps.push("Saving income sources")
      const incomeSourcesRecord = await IncomeSources.findOneAndUpdate(
        { userId, taxYear },
        { userId, taxYear, selectedSources: incomeSources.selectedSources },
        { upsert: true, new: true, session },
      )
      savedData.incomeSources = incomeSourcesRecord
    }

    // Step 4-8: Save Income Details
    if (incomeDetails) {
      processingSteps.push("Saving income details")

      // Salary Income
      if (incomeDetails.salaryIncome) {
        const salaryRecord = await SalaryIncome.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...incomeDetails.salaryIncome },
          { upsert: true, new: true, session },
        )
        savedData.salaryIncome = salaryRecord
      }

      // Business Income
      if (incomeDetails.businessIncome) {
        const businessRecord = await BusinessIncome.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...incomeDetails.businessIncome },
          { upsert: true, new: true, session },
        )
        savedData.businessIncome = businessRecord
      }

      // Freelancer Income
      if (incomeDetails.freelancerIncome) {
        const freelancerRecord = await FreelancerIncome.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...incomeDetails.freelancerIncome },
          { upsert: true, new: true, session },
        )
        savedData.freelancerIncome = freelancerRecord
      }

      // Professional Services Income
      if (incomeDetails.professionalServicesIncome) {
        const professionalRecord = await ProfessionalServicesIncome.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...incomeDetails.professionalServicesIncome },
          { upsert: true, new: true, session },
        )
        savedData.professionalServicesIncome = professionalRecord
      }

      // Agriculture Income
      if (incomeDetails.agricultureIncome) {
        const agricultureRecord = await AgricultureIncome.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...incomeDetails.agricultureIncome },
          { upsert: true, new: true, session },
        )
        savedData.agricultureIncome = agricultureRecord
      }

      // Commission/Service Income
      if (incomeDetails.commissionServiceIncome) {
        const commissionRecord = await CommissionServiceIncome.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...incomeDetails.commissionServiceIncome },
          { upsert: true, new: true, session },
        )
        savedData.commissionServiceIncome = commissionRecord
      }

      // Partnership/AOP Income
      if (incomeDetails.partnershipAOPIncome) {
        const partnershipRecord = await PartnershipAOPIncome.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...incomeDetails.partnershipAOPIncome },
          { upsert: true, new: true, session },
        )
        savedData.partnershipAOPIncome = partnershipRecord
      }

      // Rent Income
      if (incomeDetails.rentIncome) {
        const rentRecord = await RentIncome.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...incomeDetails.rentIncome },
          { upsert: true, new: true, session },
        )
        savedData.rentIncome = rentRecord
      }

      // Property Sale Income
      if (incomeDetails.propertySaleIncome) {
        const propertySaleRecord = await PropertySaleIncome.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...incomeDetails.propertySaleIncome },
          { upsert: true, new: true, session },
        )
        savedData.propertySaleIncome = propertySaleRecord
      }

      // Profit on Savings
      if (incomeDetails.profitOnSavings) {
        const profitRecord = await ProfitOnSavings.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...incomeDetails.profitOnSavings },
          { upsert: true, new: true, session },
        )
        savedData.profitOnSavings = profitRecord
      }

      // Dividend/Capital Gain Income
      if (incomeDetails.dividendCapitalGainIncome) {
        const dividendRecord = await DividendCapitalGainIncome.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...incomeDetails.dividendCapitalGainIncome },
          { upsert: true, new: true, session },
        )
        savedData.dividendCapitalGainIncome = dividendRecord
      }

      // Other Income
      if (incomeDetails.otherIncome) {
        const otherIncomeRecord = await OtherIncome.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...incomeDetails.otherIncome },
          { upsert: true, new: true, session },
        )
        savedData.otherIncome = otherIncomeRecord
      }
    }

    // Step 9: Save Tax Credits
    if (taxCredits) {
      processingSteps.push("Saving tax credits")
      const taxCreditRecord = await TaxCredit.findOneAndUpdate(
        { userId, taxYear },
        { userId, taxYear, ...taxCredits },
        { upsert: true, new: true, session },
      )
      savedData.taxCredits = taxCreditRecord
    }

    // Step 10: Save Assets & Wealth
    if (openingWealth) {
      processingSteps.push("Saving opening wealth")
      const openingWealthRecord = await OpeningWealth.findOneAndUpdate(
        { userId, taxYear },
        { userId, taxYear, ...openingWealth },
        { upsert: true, new: true, session },
      )
      savedData.openingWealth = openingWealthRecord
    }

    if (assetSelection) {
      processingSteps.push("Saving asset selection")
      const assetSelectionRecord = await AssetSelection.findOneAndUpdate(
        { userId, taxYear },
        { userId, taxYear, ...assetSelection },
        { upsert: true, new: true, session },
      )
      savedData.assetSelection = assetSelectionRecord
    }

    // Save Asset Details
    if (assetDetails) {
      processingSteps.push("Saving asset details")

      // Property Assets
      if (assetDetails.propertyAssets && Array.isArray(assetDetails.propertyAssets)) {
        await PropertyAsset.deleteMany({ userId, taxYear }, { session })
        const propertyAssets = await PropertyAsset.insertMany(
          assetDetails.propertyAssets.map((asset) => ({ ...asset, userId, taxYear })),
          { session },
        )
        savedData.propertyAssets = propertyAssets
      }

      // Vehicle Assets
      if (assetDetails.vehicleAssets && Array.isArray(assetDetails.vehicleAssets)) {
        await VehicleAsset.deleteMany({ userId, taxYear }, { session })
        const vehicleAssets = await VehicleAsset.insertMany(
          assetDetails.vehicleAssets.map((asset) => ({ ...asset, userId, taxYear })),
          { session },
        )
        savedData.vehicleAssets = vehicleAssets
      }

      // Bank Account Assets
      if (assetDetails.bankAccountAssets && Array.isArray(assetDetails.bankAccountAssets)) {
        await BankAccountAsset.deleteMany({ userId, taxYear }, { session })
        const bankAccountAssets = await BankAccountAsset.insertMany(
          assetDetails.bankAccountAssets.map((asset) => ({ ...asset, userId, taxYear })),
          { session },
        )
        savedData.bankAccountAssets = bankAccountAssets
      }

      // Cash Asset
      if (assetDetails.cashAsset) {
        const cashAssetRecord = await CashAsset.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...assetDetails.cashAsset },
          { upsert: true, new: true, session },
        )
        savedData.cashAsset = cashAssetRecord
      }

      // Insurance Assets
      if (assetDetails.insuranceAssets && Array.isArray(assetDetails.insuranceAssets)) {
        await InsuranceAsset.deleteMany({ userId, taxYear }, { session })
        const insuranceAssets = await InsuranceAsset.insertMany(
          assetDetails.insuranceAssets.map((asset) => ({ ...asset, userId, taxYear })),
          { session },
        )
        savedData.insuranceAssets = insuranceAssets
      }

      // Possession Assets
      if (assetDetails.possessionAssets && Array.isArray(assetDetails.possessionAssets)) {
        await PossessionAsset.deleteMany({ userId, taxYear }, { session })
        const possessionAssets = await PossessionAsset.insertMany(
          assetDetails.possessionAssets.map((asset) => ({ ...asset, userId, taxYear })),
          { session },
        )
        savedData.possessionAssets = possessionAssets
      }

      // Foreign Assets
      if (assetDetails.foreignAssets && Array.isArray(assetDetails.foreignAssets)) {
        await ForeignAsset.deleteMany({ userId, taxYear }, { session })
        const foreignAssets = await ForeignAsset.insertMany(
          assetDetails.foreignAssets.map((asset) => ({ ...asset, userId, taxYear })),
          { session },
        )
        savedData.foreignAssets = foreignAssets
      }

      // Other Assets
      if (assetDetails.otherAssets && Array.isArray(assetDetails.otherAssets)) {
        await OtherAsset.deleteMany({ userId, taxYear }, { session })
        const otherAssets = await OtherAsset.insertMany(
          assetDetails.otherAssets.map((asset) => ({ ...asset, userId, taxYear })),
          { session },
        )
        savedData.otherAssets = otherAssets
      }
    }

    // Step 11: Save Deductions
    if (deductions) {
      processingSteps.push("Saving deductions")

      // Bank Transactions
      if (deductions.bankTransactions && Array.isArray(deductions.bankTransactions)) {
        await BankTransaction.deleteMany({ userId, taxYear }, { session })
        const bankTransactions = await BankTransaction.insertMany(
          deductions.bankTransactions.map((transaction) => ({ ...transaction, userId, taxYear })),
          { session },
        )
        savedData.bankTransactions = bankTransactions
      }

      // Utility Deductions
      if (deductions.utilityDeductions && Array.isArray(deductions.utilityDeductions)) {
        await UtilityDeduction.deleteMany({ userId, taxYear }, { session })
        const utilityDeductions = await UtilityDeduction.insertMany(
          deductions.utilityDeductions.map((deduction) => ({ ...deduction, userId, taxYear })),
          { session },
        )
        savedData.utilityDeductions = utilityDeductions
      }

      // Vehicle Deductions
      if (deductions.vehicleDeductions && Array.isArray(deductions.vehicleDeductions)) {
        await VehicleDeduction.deleteMany({ userId, taxYear }, { session })
        const vehicleDeductions = await VehicleDeduction.insertMany(
          deductions.vehicleDeductions.map((deduction) => ({ ...deduction, userId, taxYear })),
          { session },
        )
        savedData.vehicleDeductions = vehicleDeductions
      }

      // Other Deductions
      if (deductions.otherDeductions) {
        const otherDeductionRecord = await OtherDeduction.findOneAndUpdate(
          { userId, taxYear },
          { userId, taxYear, ...deductions.otherDeductions },
          { upsert: true, new: true, session },
        )
        savedData.otherDeductions = otherDeductionRecord
      }
    }

    // Step 12: Save Liabilities & Expenses
    if (liabilities) {
      processingSteps.push("Saving liabilities")

      // Bank Loans
      if (liabilities.bankLoans && Array.isArray(liabilities.bankLoans)) {
        await BankLoan.deleteMany({ userId, taxYear }, { session })
        const bankLoans = await BankLoan.insertMany(
          liabilities.bankLoans.map((loan) => ({ ...loan, userId, taxYear })),
          { session },
        )
        savedData.bankLoans = bankLoans
      }

      // Other Liabilities
      if (liabilities.otherLiabilities && Array.isArray(liabilities.otherLiabilities)) {
        await OtherLiability.deleteMany({ userId, taxYear }, { session })
        const otherLiabilities = await OtherLiability.insertMany(
          liabilities.otherLiabilities.map((liability) => ({ ...liability, userId, taxYear })),
          { session },
        )
        savedData.otherLiabilities = otherLiabilities
      }
    }

    if (expenses) {
      processingSteps.push("Saving expenses")
      const expenseRecord = await Expense.findOneAndUpdate(
        { userId, taxYear },
        { userId, taxYear, ...expenses },
        { upsert: true, new: true, session },
      )
      savedData.expenses = expenseRecord
    }

    // Wrap-up & Finalization
    if (wrapUp) {
      processingSteps.push("Processing wrap-up and finalization")
      const finalizationRecord = await TaxFinalization.findOneAndUpdate(
        { userId, taxYear },
        {
          userId,
          taxYear,
          autoAdjustWealth: wrapUp.autoAdjustWealth || false,
          termsAccepted: wrapUp.termsAccepted || false,
          finalizedAt: new Date(),
        },
        { upsert: true, new: true, session },
      )
      savedData.finalization = finalizationRecord
    }

    // Handle Cart & Checkout
    let cartSummary = {}
    let checkoutDetails = {}

    if (cart || checkout) {
      processingSteps.push("Processing cart and checkout")

      // Get service charges for cart calculation
      const serviceCharges = await ServiceCharge.find({})

      // Calculate cart items and total
      const cartItems = []
      let totalAmount = 0

      // Base tax filing service
      const baseTaxFilingCharge = serviceCharges.find((service) => service.category === "Tax Filing Services")

      if (baseTaxFilingCharge && baseTaxFilingCharge.services.length > 0) {
        const baseService = baseTaxFilingCharge.services[0]
        cartItems.push({
          serviceId: baseTaxFilingCharge._id,
          serviceName: baseService.serviceName,
          category: "Tax Filing Services",
          fee: Number.parseFloat(baseService.fee.replace(/[^\d.]/g, "")),
          quantity: 1,
        })
        totalAmount += Number.parseFloat(baseService.fee.replace(/[^\d.]/g, ""))
      }

      // Additional services from cart
      if (cart && cart.additionalServices && Array.isArray(cart.additionalServices)) {
        for (const serviceId of cart.additionalServices) {
          const service = serviceCharges.find((s) => s._id.toString() === serviceId)
          if (service && service.services.length > 0) {
            const serviceDetail = service.services[0]
            cartItems.push({
              serviceId: service._id,
              serviceName: serviceDetail.serviceName,
              category: service.category,
              fee: Number.parseFloat(serviceDetail.fee.replace(/[^\d.]/g, "")),
              quantity: 1,
            })
            totalAmount += Number.parseFloat(serviceDetail.fee.replace(/[^\d.]/g, ""))
          }
        }
      }

      cartSummary = {
        items: cartItems,
        totalItems: cartItems.length,
        subtotal: totalAmount,
        tax: totalAmount * 0.17, // 17% tax
        total: totalAmount + totalAmount * 0.17,
      }

      // Process checkout if provided
      if (checkout) {
        checkoutDetails = {
          paymentMethod: checkout.paymentMethod || "pending",
          paymentStatus: checkout.paymentStatus || "pending",
          billingAddress: checkout.billingAddress || {},
          paymentDate: checkout.paymentMethod ? new Date() : null,
          transactionId: checkout.paymentMethod ? `TXN-${Date.now()}` : null,
        }

        // Update tax filing with payment info
        taxFiling.payment = {
          amount: cartSummary.total,
          date: checkoutDetails.paymentDate,
          method: checkoutDetails.paymentMethod,
          status: checkoutDetails.paymentStatus,
          transactionId: checkoutDetails.transactionId,
        }
      }
    }

    // Update tax filing status
    processingSteps.push("Finalizing tax filing submission")
    taxFiling.status = wrapUp && wrapUp.termsAccepted ? "completed" : "under_review"
    taxFiling.submittedAt = new Date()
    taxFiling.processingSteps = processingSteps

    await taxFiling.save({ session })

    // Commit transaction
    await session.commitTransaction()

    // Calculate summary statistics
    const summary = {
      totalIncomeStreams: Object.keys(savedData).filter((key) => key.includes("Income") && savedData[key]).length,
      totalAssets: Object.keys(savedData).filter((key) => key.includes("Asset") && savedData[key]).length,
      totalDeductions: Object.keys(savedData).filter((key) => key.includes("Deduction") || key.includes("Transaction"))
        .length,
      totalLiabilities: Object.keys(savedData).filter((key) => key.includes("Loan") || key.includes("Liability"))
        .length,
      isFinalized: !!savedData.finalization,
      processingSteps: processingSteps.length,
    }

    return res.status(201).json({
      success: true,
      message: "Comprehensive tax filing submitted successfully",
      data: {
        taxFiling: {
          id: taxFiling._id,
          userId: taxFiling.userId,
          taxYear: taxFiling.taxYear,
          filingType: taxFiling.filingType,
          status: taxFiling.status,
          submittedAt: taxFiling.submittedAt,
          payment: taxFiling.payment,
        },
        savedData,
        summary,
        cart: cartSummary,
        checkout: checkoutDetails,
        processingSteps,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    // Rollback transaction
    await session.abortTransaction()
    console.error("Error in comprehensive tax filing submission:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to submit comprehensive tax filing",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  } finally {
    session.endSession()
  }
}

// Get Complete Tax Filing Data (Modified to handle missing tax filing)
export const getCompleteTaxFilingData = async (req, res) => {
  try {
    const { taxYear } = req.query
    const userId = req.user._id

    if (!taxYear) {
      return res.status(400).json({
        success: false,
        message: "Tax year is required",
      })
    }

    // Get user info
    const user = await User.findById(userId).select("-password")

    // Get tax filing record (optional - can be null)
    const taxFiling = await TaxFiling.findOne({ userId, taxYear })

    // Fetch all related data in parallel (regardless of tax filing existence)
    const [
      personalInfo,
      incomeSources,
      salaryIncome,
      businessIncome,
      freelancerIncome,
      professionalServicesIncome,
      agricultureIncome,
      commissionServiceIncome,
      partnershipAOPIncome,
      rentIncome,
      propertySaleIncome,
      profitOnSavings,
      dividendCapitalGainIncome,
      otherIncome,
      taxCredits,
      openingWealth,
      assetSelection,
      propertyAssets,
      vehicleAssets,
      bankAccountAssets,
      cashAsset,
      insuranceAssets,
      possessionAssets,
      foreignAssets,
      otherAssets,
      bankTransactions,
      utilityDeductions,
      vehicleDeductions,
      otherDeductions,
      bankLoans,
      otherLiabilities,
      expenses,
      finalization,
      serviceCharges,
    ] = await Promise.all([
      taxFiling ? PersonalInfo.findOne({ filingId: taxFiling._id }) : null,
      IncomeSources.findOne({ userId, taxYear }),
      SalaryIncome.findOne({ userId, taxYear }),
      BusinessIncome.findOne({ userId, taxYear }),
      FreelancerIncome.findOne({ userId, taxYear }),
      ProfessionalServicesIncome.findOne({ userId, taxYear }),
      AgricultureIncome.findOne({ userId, taxYear }),
      CommissionServiceIncome.findOne({ userId, taxYear }),
      PartnershipAOPIncome.findOne({ userId, taxYear }),
      RentIncome.findOne({ userId, taxYear }),
      PropertySaleIncome.findOne({ userId, taxYear }),
      ProfitOnSavings.findOne({ userId, taxYear }),
      DividendCapitalGainIncome.findOne({ userId, taxYear }),
      OtherIncome.findOne({ userId, taxYear }),
      TaxCredit.findOne({ userId, taxYear }),
      OpeningWealth.findOne({ userId, taxYear }),
      AssetSelection.findOne({ userId, taxYear }),
      PropertyAsset.find({ userId, taxYear }),
      VehicleAsset.find({ userId, taxYear }),
      BankAccountAsset.find({ userId, taxYear }),
      CashAsset.findOne({ userId, taxYear }),
      InsuranceAsset.find({ userId, taxYear }),
      PossessionAsset.find({ userId, taxYear }),
      ForeignAsset.find({ userId, taxYear }),
      OtherAsset.find({ userId, taxYear }),
      BankTransaction.find({ userId, taxYear }),
      UtilityDeduction.find({ userId, taxYear }),
      VehicleDeduction.find({ userId, taxYear }),
      OtherDeduction.findOne({ userId, taxYear }),
      BankLoan.find({ userId, taxYear }),
      OtherLiability.find({ userId, taxYear }),
      Expense.findOne({ userId, taxYear }),
      TaxFinalization.findOne({ userId, taxYear }),
      ServiceCharge.find({}),
    ])

    // Organize the complete data
    const completeData = {
      user,
      taxFiling: taxFiling
        ? {
            id: taxFiling._id,
            userId: taxFiling.userId,
            taxYear: taxFiling.taxYear,
            filingType: taxFiling.filingType,
            status: taxFiling.status,
            submittedAt: taxFiling.submittedAt,
            payment: taxFiling.payment,
            processingSteps: taxFiling.processingSteps,
          }
        : null,

      // Step 2: Personal Information
      personalInfo,

      // Step 3: Income Sources
      incomeSources,

      // Step 4-8: Income Details
      incomeDetails: {
        salaryIncome,
        businessIncome,
        freelancerIncome,
        professionalServicesIncome,
        agricultureIncome,
        commissionServiceIncome,
        partnershipAOPIncome,
        rentIncome,
        propertySaleIncome,
        profitOnSavings,
        dividendCapitalGainIncome,
        otherIncome,
      },

      // Step 9: Tax Credits
      taxCredits,

      // Step 10: Assets & Wealth
      wealth: {
        openingWealth,
        assetSelection,
        assets: {
          propertyAssets,
          vehicleAssets,
          bankAccountAssets,
          cashAsset,
          insuranceAssets,
          possessionAssets,
          foreignAssets,
          otherAssets,
        },
      },

      // Step 11: Deductions
      deductions: {
        bankTransactions,
        utilityDeductions,
        vehicleDeductions,
        otherDeductions,
      },

      // Step 12: Liabilities & Expenses
      liabilitiesAndExpenses: {
        bankLoans,
        otherLiabilities,
        expenses,
      },

      // Finalization
      finalization,

      // Available Services
      availableServices: serviceCharges,
    }

    // Calculate summary statistics
    const summary = {
      completionPercentage: calculateCompletionPercentage(completeData),
      totalIncomeStreams: Object.values(completeData.incomeDetails).filter((income) => income !== null).length,
      totalAssets: Object.values(completeData.wealth.assets).filter(
        (asset) => asset !== null && (!Array.isArray(asset) || asset.length > 0),
      ).length,
      totalDeductions: Object.values(completeData.deductions).filter(
        (deduction) => deduction !== null && (!Array.isArray(deduction) || deduction.length > 0),
      ).length,
      totalLiabilities:
        completeData.liabilitiesAndExpenses.bankLoans.length +
        completeData.liabilitiesAndExpenses.otherLiabilities.length,
      isFinalized: !!completeData.finalization,
      hasPayment: !!(completeData.taxFiling && completeData.taxFiling.payment),
      hasTaxFiling: !!completeData.taxFiling,
    }

    return res.status(200).json({
      success: true,
      message: completeData.taxFiling
        ? "Complete tax filing data retrieved successfully"
        : "Tax filing data retrieved successfully (no formal filing found)",
      data: completeData,
      summary,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error retrieving complete tax filing data:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve tax filing data",
      error: error.message,
    })
  }
}

// Helper function to calculate completion percentage
function calculateCompletionPercentage(data) {
  let completedSteps = 0
  const totalSteps = 12

  // Check each step completion
  if (data.personalInfo) completedSteps++
  if (data.incomeSources) completedSteps++
  if (Object.values(data.incomeDetails).some((income) => income !== null)) completedSteps++
  if (data.taxCredits) completedSteps++
  if (data.wealth.openingWealth) completedSteps++
  if (data.wealth.assetSelection) completedSteps++
  if (Object.values(data.wealth.assets).some((asset) => asset !== null && (!Array.isArray(asset) || asset.length > 0)))
    completedSteps++
  if (
    Object.values(data.deductions).some(
      (deduction) => deduction !== null && (!Array.isArray(deduction) || deduction.length > 0),
    )
  )
    completedSteps++
  if (data.liabilitiesAndExpenses.expenses) completedSteps++
  if (data.liabilitiesAndExpenses.bankLoans.length > 0 || data.liabilitiesAndExpenses.otherLiabilities.length > 0)
    completedSteps++
  if (data.finalization) completedSteps++
  if (data.taxFiling && data.taxFiling.payment) completedSteps++

  return Math.round((completedSteps / totalSteps) * 100)
}
