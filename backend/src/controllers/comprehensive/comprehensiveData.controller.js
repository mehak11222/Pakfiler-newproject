// Import all models
import ProfitOnSavings from "../../models/incomeDetails/profitOnSavings.model.js"
import PropertyAsset from "../../models/assetDetails/propertyAsset.model.js"
import PropertySaleIncome from "../../models/incomeDetails/propertySale.js"
import RentIncome from "../../models/incomeDetails/rent.js"
import SalaryIncome from "../../models/incomeDetails/salaryIncome.model.js"
import { ServiceCharge } from "../../models/ServiceCharge/serviceCharge.model.js"
import TaxCredit from "../../models/taxCredits/taxCredits.js"
import TaxFiling from "../../models/TaxFiling/TaxFiling.js"
import TaxFinalization from "../../models/taxFinalization/taxFinalization.model.js"
import User from "../../models/User.js"
import UtilityDeduction from "../../models/deduction/utilityDeduction.js"
import VehicleAsset from "../../models/assetDetails/vehicle.model.js"
import VehicleDeduction from "../../models/deduction/vehicleDeduction.js"
import AgricultureIncome from "../../models/incomeDetails/agriculture.js"
import AssetSelection from "../../models/assetSelection/assetSelection.model.js"
import BankAccountAsset from "../../models/assetDetails/bankAccount.model.js"
import BankLoan from "../../models/bankLoan/bankLoan.model.js"
import BankTransaction from "../../models/deduction/bankTransaction.js"
import BusinessIncome from "../../models/incomeDetails/businessIncome.model.js"
import BusinessIncorporation from "../../models/businessIncorporation/businessIncorporation.model.js"
import CashAsset from "../../models/assetDetails/cash.model.js"
import CommissionServiceIncome from "../../models/incomeDetails/commission.js"
import DividendCapitalGainIncome from "../../models/incomeDetails/dividend.js"
import Document from "../../models/Document.js"
import Expense from "../../models/expense/expense.model.js"
import FamilyAccount from "../../models/FamilyTaxFilling/familyAccount.model.js"
import ForeignAsset from "../../models/assetDetails/foreignAsset.model.js"
import FreelancerIncome from "../../models/incomeDetails/freelancerIncome.model.js"
import GSTRegistration from "../../models/gst/gstRegistration.model.js"
import IncomeSources from "../../models/incomeSources.model.js"
import InsuranceAsset from "../../models/assetDetails/insurance.model.js"
import IRISProfile from "../../models/irisProfile/irisProfile.model.js"
import NTNRegistration from "../../models/ntnRegistration/ntnRegistration.model.js"
import OpeningWealth from "../../models/openingWealth/openingWealth.model.js"
import OtherAsset from "../../models/assetDetails/otherAsset.model.js"
import OtherDeduction from "../../models/deduction/otherDeduction.js"
import OtherIncome from "../../models/incomeDetails/otherIncome.js"
import OtherLiability from "../../models/bankLoan/otherLiability.model.js"
import PartnershipAOPIncome from "../../models/incomeDetails/partnership.js"
import PersonalInfo from "../../models/PersonalInfo.js"
import PossessionAsset from "../../models/assetDetails/possession.model.js"
import ProfessionalServicesIncome from "../../models/incomeDetails/professionalServices.model.js"

// GET API - Fetch all data for a user
export const getAllUserData = async (req, res) => {
  try {
    const { userId, taxYear } = req.query

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      })
    }

    // Fetch all data in parallel
    const [
      // Income Details
      profitOnSavings,
      propertySaleIncome,
      rentIncome,
      salaryIncome,
      agricultureIncome,
      businessIncome,
      commissionServiceIncome,
      dividendCapitalGainIncome,
      freelancerIncome,
      otherIncome,
      partnershipAOPIncome,
      professionalServicesIncome,

      // Asset Details
      propertyAssets,
      vehicleAssets,
      bankAccountAssets,
      cashAsset,
      foreignAssets,
      insuranceAssets,
      otherAssets,
      possessionAssets,

      // Deductions
      utilityDeductions,
      vehicleDeductions,
      bankTransactions,
      otherDeduction,

      // Liabilities & Expenses
      bankLoans,
      otherLiabilities,
      expense,

      // Tax & Filing
      taxCredits,
      taxFilings,
      taxFinalization,

      // User & Profile Data
      user,
      personalInfo,
      familyAccounts,
      irisProfile,
      ntnRegistration,

      // Other Data
      assetSelection,
      incomeSources,
      openingWealth,
      businessIncorporation,
      gstRegistrations,
      documents,
      serviceCharges,
    ] = await Promise.all([
      // Income Details
      ProfitOnSavings.findOne({ userId, ...(taxYear && { taxYear }) }),
      PropertySaleIncome.findOne({ userId, ...(taxYear && { taxYear }) }),
      RentIncome.findOne({ userId, ...(taxYear && { taxYear }) }),
      SalaryIncome.findOne({ userId, ...(taxYear && { taxYear }) }),
      AgricultureIncome.findOne({ userId, ...(taxYear && { taxYear }) }),
      BusinessIncome.findOne({ userId, ...(taxYear && { taxYear }) }),
      CommissionServiceIncome.findOne({ userId, ...(taxYear && { taxYear }) }),
      DividendCapitalGainIncome.findOne({ userId, ...(taxYear && { taxYear }) }),
      FreelancerIncome.findOne({ userId, ...(taxYear && { taxYear }) }),
      OtherIncome.findOne({ userId, ...(taxYear && { taxYear }) }),
      PartnershipAOPIncome.findOne({ userId, ...(taxYear && { taxYear }) }),
      ProfessionalServicesIncome.findOne({ userId, ...(taxYear && { taxYear }) }),

      // Asset Details
      PropertyAsset.find({ userId, ...(taxYear && { taxYear }) }),
      VehicleAsset.find({ userId, ...(taxYear && { taxYear }) }),
      BankAccountAsset.find({ userId, ...(taxYear && { taxYear }) }),
      CashAsset.findOne({ userId, ...(taxYear && { taxYear }) }),
      ForeignAsset.find({ userId, ...(taxYear && { taxYear }) }),
      InsuranceAsset.find({ userId, ...(taxYear && { taxYear }) }),
      OtherAsset.find({ userId, ...(taxYear && { taxYear }) }),
      PossessionAsset.find({ userId, ...(taxYear && { taxYear }) }),

      // Deductions
      UtilityDeduction.find({ userId, ...(taxYear && { taxYear }) }),
      VehicleDeduction.find({ userId, ...(taxYear && { taxYear }) }),
      BankTransaction.find({ userId, ...(taxYear && { taxYear }) }),
      OtherDeduction.findOne({ userId, ...(taxYear && { taxYear }) }),

      // Liabilities & Expenses
      BankLoan.find({ userId, ...(taxYear && { taxYear }) }),
      OtherLiability.find({ userId, ...(taxYear && { taxYear }) }),
      Expense.findOne({ userId, ...(taxYear && { taxYear }) }),

      // Tax & Filing
      TaxCredit.findOne({ userId, ...(taxYear && { taxYear }) }),
      TaxFiling.find({ userId }),
      TaxFinalization.findOne({ userId, ...(taxYear && { taxYear }) }),

      // User & Profile Data
      User.findById(userId).select("-password"),
      PersonalInfo.find({ userId }),
      FamilyAccount.find({ mainUserId: userId }),
      IRISProfile.findOne({ userId }),
      NTNRegistration.findOne({ userId }),

      // Other Data
      AssetSelection.findOne({ userId, ...(taxYear && { taxYear }) }),
      IncomeSources.findOne({ userId, ...(taxYear && { taxYear }) }),
      OpeningWealth.findOne({ userId, ...(taxYear && { taxYear }) }),
      BusinessIncorporation.findOne({ userId }),
      GSTRegistration.find({ userId }),
      Document.find({ userId }),
      ServiceCharge.find({}),
    ])

    // Organize response data
    const responseData = {
      user,
      taxYear,

      // Income Details
      incomeDetails: {
        profitOnSavings,
        propertySaleIncome,
        rentIncome,
        salaryIncome,
        agricultureIncome,
        businessIncome,
        commissionServiceIncome,
        dividendCapitalGainIncome,
        freelancerIncome,
        otherIncome,
        partnershipAOPIncome,
        professionalServicesIncome,
      },

      // Asset Details
      assetDetails: {
        propertyAssets,
        vehicleAssets,
        bankAccountAssets,
        cashAsset,
        foreignAssets,
        insuranceAssets,
        otherAssets,
        possessionAssets,
        assetSelection,
        openingWealth,
      },

      // Deductions
      deductions: {
        utilityDeductions,
        vehicleDeductions,
        bankTransactions,
        otherDeduction,
      },

      // Liabilities & Expenses
      liabilitiesAndExpenses: {
        bankLoans,
        otherLiabilities,
        expense,
      },

      // Tax & Filing
      taxAndFiling: {
        taxCredits,
        taxFilings,
        taxFinalization,
      },

      // Profile & Registration
      profileAndRegistration: {
        personalInfo,
        familyAccounts,
        irisProfile,
        ntnRegistration,
        businessIncorporation,
        gstRegistrations,
      },

      // Other Data
      otherData: {
        incomeSources,
        documents,
        serviceCharges,
      },
    }

    // Calculate summary statistics
    const summary = {
      totalIncomeStreams: Object.values(responseData.incomeDetails).filter((item) => item !== null).length,
      totalAssets: Object.values(responseData.assetDetails).filter(
        (item) => item !== null && (!Array.isArray(item) || item.length > 0),
      ).length,
      totalDeductions: Object.values(responseData.deductions).filter(
        (item) => item !== null && (!Array.isArray(item) || item.length > 0),
      ).length,
      totalLiabilities: Object.values(responseData.liabilitiesAndExpenses).filter(
        (item) => item !== null && (!Array.isArray(item) || item.length > 0),
      ).length,
      taxFilingStatus: taxFinalization ? "Finalized" : "Pending",
      profileCompleteness: calculateProfileCompleteness(responseData),
    }

    return res.status(200).json({
      success: true,
      message: "All user data fetched successfully",
      data: responseData,
      summary,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in getAllUserData:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
      error: error.message,
    })
  }
}

// POST API - Save all user data
export const saveAllUserData = async (req, res) => {
  try {
    const { userId, taxYear, data } = req.body

    if (!userId || !data) {
      return res.status(400).json({
        success: false,
        message: "userId and data are required",
      })
    }

    const savedData = {}
    const errors = []

    // Save Income Details
    if (data.incomeDetails) {
      try {
        if (data.incomeDetails.profitOnSavings) {
          savedData.profitOnSavings = await upsertData(
            ProfitOnSavings,
            { userId, taxYear },
            data.incomeDetails.profitOnSavings,
          )
        }
        if (data.incomeDetails.propertySaleIncome) {
          savedData.propertySaleIncome = await upsertData(
            PropertySaleIncome,
            { userId, taxYear },
            data.incomeDetails.propertySaleIncome,
          )
        }
        if (data.incomeDetails.rentIncome) {
          savedData.rentIncome = await upsertData(RentIncome, { userId, taxYear }, data.incomeDetails.rentIncome)
        }
        if (data.incomeDetails.salaryIncome) {
          savedData.salaryIncome = await upsertData(SalaryIncome, { userId, taxYear }, data.incomeDetails.salaryIncome)
        }
        if (data.incomeDetails.agricultureIncome) {
          savedData.agricultureIncome = await upsertData(
            AgricultureIncome,
            { userId, taxYear },
            data.incomeDetails.agricultureIncome,
          )
        }
        if (data.incomeDetails.businessIncome) {
          savedData.businessIncome = await upsertData(
            BusinessIncome,
            { userId, taxYear },
            data.incomeDetails.businessIncome,
          )
        }
        if (data.incomeDetails.commissionServiceIncome) {
          savedData.commissionServiceIncome = await upsertData(
            CommissionServiceIncome,
            { userId, taxYear },
            data.incomeDetails.commissionServiceIncome,
          )
        }
        if (data.incomeDetails.dividendCapitalGainIncome) {
          savedData.dividendCapitalGainIncome = await upsertData(
            DividendCapitalGainIncome,
            { userId, taxYear },
            data.incomeDetails.dividendCapitalGainIncome,
          )
        }
        if (data.incomeDetails.freelancerIncome) {
          savedData.freelancerIncome = await upsertData(
            FreelancerIncome,
            { userId, taxYear },
            data.incomeDetails.freelancerIncome,
          )
        }
        if (data.incomeDetails.otherIncome) {
          savedData.otherIncome = await upsertData(OtherIncome, { userId, taxYear }, data.incomeDetails.otherIncome)
        }
        if (data.incomeDetails.partnershipAOPIncome) {
          savedData.partnershipAOPIncome = await upsertData(
            PartnershipAOPIncome,
            { userId, taxYear },
            data.incomeDetails.partnershipAOPIncome,
          )
        }
        if (data.incomeDetails.professionalServicesIncome) {
          savedData.professionalServicesIncome = await upsertData(
            ProfessionalServicesIncome,
            { userId, taxYear },
            data.incomeDetails.professionalServicesIncome,
          )
        }
      } catch (error) {
        errors.push({ section: "incomeDetails", error: error.message })
      }
    }

    // Save Asset Details
    if (data.assetDetails) {
      try {
        if (data.assetDetails.propertyAssets && Array.isArray(data.assetDetails.propertyAssets)) {
          savedData.propertyAssets = await saveArrayData(
            PropertyAsset,
            { userId, taxYear },
            data.assetDetails.propertyAssets,
          )
        }
        if (data.assetDetails.vehicleAssets && Array.isArray(data.assetDetails.vehicleAssets)) {
          savedData.vehicleAssets = await saveArrayData(
            VehicleAsset,
            { userId, taxYear },
            data.assetDetails.vehicleAssets,
          )
        }
        if (data.assetDetails.bankAccountAssets && Array.isArray(data.assetDetails.bankAccountAssets)) {
          savedData.bankAccountAssets = await saveArrayData(
            BankAccountAsset,
            { userId, taxYear },
            data.assetDetails.bankAccountAssets,
          )
        }
        if (data.assetDetails.cashAsset) {
          savedData.cashAsset = await upsertData(CashAsset, { userId, taxYear }, data.assetDetails.cashAsset)
        }
        if (data.assetDetails.foreignAssets && Array.isArray(data.assetDetails.foreignAssets)) {
          savedData.foreignAssets = await saveArrayData(
            ForeignAsset,
            { userId, taxYear },
            data.assetDetails.foreignAssets,
          )
        }
        if (data.assetDetails.insuranceAssets && Array.isArray(data.assetDetails.insuranceAssets)) {
          savedData.insuranceAssets = await saveArrayData(
            InsuranceAsset,
            { userId, taxYear },
            data.assetDetails.insuranceAssets,
          )
        }
        if (data.assetDetails.otherAssets && Array.isArray(data.assetDetails.otherAssets)) {
          savedData.otherAssets = await saveArrayData(OtherAsset, { userId, taxYear }, data.assetDetails.otherAssets)
        }
        if (data.assetDetails.possessionAssets && Array.isArray(data.assetDetails.possessionAssets)) {
          savedData.possessionAssets = await saveArrayData(
            PossessionAsset,
            { userId, taxYear },
            data.assetDetails.possessionAssets,
          )
        }
        if (data.assetDetails.assetSelection) {
          savedData.assetSelection = await upsertData(
            AssetSelection,
            { userId, taxYear },
            data.assetDetails.assetSelection,
          )
        }
        if (data.assetDetails.openingWealth) {
          savedData.openingWealth = await upsertData(
            OpeningWealth,
            { userId, taxYear },
            data.assetDetails.openingWealth,
          )
        }
      } catch (error) {
        errors.push({ section: "assetDetails", error: error.message })
      }
    }

    // Save Deductions
    if (data.deductions) {
      try {
        if (data.deductions.utilityDeductions && Array.isArray(data.deductions.utilityDeductions)) {
          savedData.utilityDeductions = await saveArrayData(
            UtilityDeduction,
            { userId, taxYear },
            data.deductions.utilityDeductions,
          )
        }
        if (data.deductions.vehicleDeductions && Array.isArray(data.deductions.vehicleDeductions)) {
          savedData.vehicleDeductions = await saveArrayData(
            VehicleDeduction,
            { userId, taxYear },
            data.deductions.vehicleDeductions,
          )
        }
        if (data.deductions.bankTransactions && Array.isArray(data.deductions.bankTransactions)) {
          savedData.bankTransactions = await saveArrayData(
            BankTransaction,
            { userId, taxYear },
            data.deductions.bankTransactions,
          )
        }
        if (data.deductions.otherDeduction) {
          savedData.otherDeduction = await upsertData(
            OtherDeduction,
            { userId, taxYear },
            data.deductions.otherDeduction,
          )
        }
      } catch (error) {
        errors.push({ section: "deductions", error: error.message })
      }
    }

    // Save Liabilities & Expenses
    if (data.liabilitiesAndExpenses) {
      try {
        if (data.liabilitiesAndExpenses.bankLoans && Array.isArray(data.liabilitiesAndExpenses.bankLoans)) {
          savedData.bankLoans = await saveArrayData(
            BankLoan,
            { userId, taxYear },
            data.liabilitiesAndExpenses.bankLoans,
          )
        }
        if (
          data.liabilitiesAndExpenses.otherLiabilities &&
          Array.isArray(data.liabilitiesAndExpenses.otherLiabilities)
        ) {
          savedData.otherLiabilities = await saveArrayData(
            OtherLiability,
            { userId, taxYear },
            data.liabilitiesAndExpenses.otherLiabilities,
          )
        }
        if (data.liabilitiesAndExpenses.expense) {
          savedData.expense = await upsertData(Expense, { userId, taxYear }, data.liabilitiesAndExpenses.expense)
        }
      } catch (error) {
        errors.push({ section: "liabilitiesAndExpenses", error: error.message })
      }
    }

    // Save Tax & Filing
    if (data.taxAndFiling) {
      try {
        if (data.taxAndFiling.taxCredits) {
          savedData.taxCredits = await upsertData(TaxCredit, { userId, taxYear }, data.taxAndFiling.taxCredits)
        }
        if (data.taxAndFiling.taxFinalization) {
          savedData.taxFinalization = await upsertData(
            TaxFinalization,
            { userId, taxYear },
            data.taxAndFiling.taxFinalization,
          )
        }
      } catch (error) {
        errors.push({ section: "taxAndFiling", error: error.message })
      }
    }

    // Save Profile & Registration
    if (data.profileAndRegistration) {
      try {
        if (data.profileAndRegistration.familyAccounts && Array.isArray(data.profileAndRegistration.familyAccounts)) {
          savedData.familyAccounts = await saveArrayData(
            FamilyAccount,
            { mainUserId: userId },
            data.profileAndRegistration.familyAccounts,
          )
        }
        if (data.profileAndRegistration.irisProfile) {
          savedData.irisProfile = await upsertData(IRISProfile, { userId }, data.profileAndRegistration.irisProfile)
        }
        if (data.profileAndRegistration.ntnRegistration) {
          savedData.ntnRegistration = await upsertData(
            NTNRegistration,
            { userId },
            data.profileAndRegistration.ntnRegistration,
          )
        }
        if (data.profileAndRegistration.businessIncorporation) {
          savedData.businessIncorporation = await upsertData(
            BusinessIncorporation,
            { userId },
            data.profileAndRegistration.businessIncorporation,
          )
        }
      } catch (error) {
        errors.push({ section: "profileAndRegistration", error: error.message })
      }
    }

    // Save Other Data
    if (data.otherData) {
      try {
        if (data.otherData.incomeSources) {
          savedData.incomeSources = await upsertData(IncomeSources, { userId, taxYear }, data.otherData.incomeSources)
        }
      } catch (error) {
        errors.push({ section: "otherData", error: error.message })
      }
    }

    return res.status(200).json({
      success: true,
      message: "All user data saved successfully",
      data: savedData,
      errors: errors.length > 0 ? errors : null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in saveAllUserData:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to save user data",
      error: error.message,
    })
  }
}

// Helper function to upsert data
async function upsertData(Model, query, data) {
  return await Model.findOneAndUpdate(query, { ...data, ...query }, { new: true, upsert: true })
}

// Helper function to save array data
async function saveArrayData(Model, baseQuery, dataArray) {
  // Delete existing records
  await Model.deleteMany(baseQuery)

  // Insert new records
  const recordsToInsert = dataArray.map((item) => ({ ...item, ...baseQuery }))
  return await Model.insertMany(recordsToInsert)
}

// Helper function to calculate profile completeness
function calculateProfileCompleteness(data) {
  let totalSections = 0
  let completedSections = 0

  // Check each section
  const sections = [
    "incomeDetails",
    "assetDetails",
    "deductions",
    "liabilitiesAndExpenses",
    "taxAndFiling",
    "profileAndRegistration",
  ]

  sections.forEach((section) => {
    totalSections++
    const sectionData = data[section]
    if (
      sectionData &&
      Object.values(sectionData).some((item) => item !== null && (!Array.isArray(item) || item.length > 0))
    ) {
      completedSections++
    }
  })

  return Math.round((completedSections / totalSections) * 100)
}

// GET API for specific data types
export const getSpecificData = async (req, res) => {
  try {
    const { dataType, userId, taxYear } = req.query

    if (!dataType || !userId) {
      return res.status(400).json({
        success: false,
        message: "dataType and userId are required",
      })
    }

    const dataTypeMap = {
      profitonsavings: ProfitOnSavings,
      propertyassets: PropertyAsset,
      propertysaleincome: PropertySaleIncome,
      rentincomes: RentIncome,
      salaryincomes: SalaryIncome,
      servicecharges: ServiceCharge,
      taxcredits: TaxCredit,
      taxfilings: TaxFiling,
      taxfinalizations: TaxFinalization,
      users: User,
      utilitydeductions: UtilityDeduction,
      vehicleassets: VehicleAsset,
      vehicledeductions: VehicleDeduction,
      agricultureincomes: AgricultureIncome,
      assetselections: AssetSelection,
      bankaccountassets: BankAccountAsset,
      bankloans: BankLoan,
      banktransactions: BankTransaction,
      businessincomes: BusinessIncome,
      businessincorporations: BusinessIncorporation,
      cashassets: CashAsset,
      commissionserviceincomes: CommissionServiceIncome,
      dividendcapitalgainincomes: DividendCapitalGainIncome,
      documents: Document,
      expenses: Expense,
      familyaccounts: FamilyAccount,
      foreignassets: ForeignAsset,
      freelancerincomes: FreelancerIncome,
      gstregistrations: GSTRegistration,
      incomesources: IncomeSources,
      insuranceassets: InsuranceAsset,
      irisprofiles: IRISProfile,
      ntnregistrations: NTNRegistration,
      openingwealths: OpeningWealth,
      otherassets: OtherAsset,
      otherdeductions: OtherDeduction,
      otherincomes: OtherIncome,
      otherliabilities: OtherLiability,
      partnershipaopincomes: PartnershipAOPIncome,
      personalinfos: PersonalInfo,
      possessionassets: PossessionAsset,
      professionalservicesincomes: ProfessionalServicesIncome,
    }

    const Model = dataTypeMap[dataType.toLowerCase()]
    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid dataType",
      })
    }

    let query = {}

    // Build query based on model structure
    if (dataType === "users") {
      query = { _id: userId }
    } else if (dataType === "familyaccounts") {
      query = { mainUserId: userId }
    } else if (["servicecharges"].includes(dataType)) {
      query = {} // No user-specific filter
    } else {
      query = { userId }
      if (
        taxYear &&
        ![
          "users",
          "businessincorporations",
          "gstregistrations",
          "ntnregistrations",
          "irisprofiles",
          "documents",
        ].includes(dataType)
      ) {
        query.taxYear = taxYear
      }
    }

    const data = await Model.find(query)

    return res.status(200).json({
      success: true,
      message: `${dataType} data fetched successfully`,
      data,
      count: data.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in getSpecificData:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch specific data",
      error: error.message,
    })
  }
}
