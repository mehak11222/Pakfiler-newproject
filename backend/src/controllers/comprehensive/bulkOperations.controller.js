// Bulk operations for multiple data types
import { Types } from "mongoose"

// Import all models (same as above)
import ProfitOnSavings from "../../models/incomeDetails/profitOnSavings.model.js"
import PropertyAsset from "../../models/assetDetails/propertyAsset.model.js"
import PropertySaleIncome from "../../models/incomeDetails/propertySale.js"
import RentIncome from "../../models/incomeDetails/rent.js"
import SalaryIncome from "../../models/incomeDetails/salaryIncome.model.js"
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

// Bulk create multiple records
export const bulkCreateRecords = async (req, res) => {
  try {
    const { dataType, records } = req.body

    if (!dataType || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: "dataType and records array are required",
      })
    }

    const modelMap = getModelMap()
    const Model = modelMap[dataType.toLowerCase()]

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid dataType",
      })
    }

    // Validate all records have required fields
    const validatedRecords = records.map((record) => {
      if (!record.userId) {
        throw new Error("userId is required for all records")
      }
      return {
        ...record,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    const createdRecords = await Model.insertMany(validatedRecords)

    return res.status(201).json({
      success: true,
      message: `${createdRecords.length} ${dataType} records created successfully`,
      data: createdRecords,
      count: createdRecords.length,
    })
  } catch (error) {
    console.error("Error in bulkCreateRecords:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to create records",
      error: error.message,
    })
  }
}

// Bulk update multiple records
export const bulkUpdateRecords = async (req, res) => {
  try {
    const { dataType, updates } = req.body

    if (!dataType || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "dataType and updates array are required",
      })
    }

    const modelMap = getModelMap()
    const Model = modelMap[dataType.toLowerCase()]

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid dataType",
      })
    }

    const updatePromises = updates.map((update) => {
      const { _id, ...updateData } = update
      if (!_id) {
        throw new Error("_id is required for all update records")
      }
      return Model.findByIdAndUpdate(_id, { ...updateData, updatedAt: new Date() }, { new: true })
    })

    const updatedRecords = await Promise.all(updatePromises)

    return res.status(200).json({
      success: true,
      message: `${updatedRecords.length} ${dataType} records updated successfully`,
      data: updatedRecords,
      count: updatedRecords.length,
    })
  } catch (error) {
    console.error("Error in bulkUpdateRecords:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to update records",
      error: error.message,
    })
  }
}

// Bulk delete multiple records
export const bulkDeleteRecords = async (req, res) => {
  try {
    const { dataType, recordIds } = req.body

    if (!dataType || !Array.isArray(recordIds) || recordIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "dataType and recordIds array are required",
      })
    }

    const modelMap = getModelMap()
    const Model = modelMap[dataType.toLowerCase()]

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid dataType",
      })
    }

    // Validate all IDs
    const validIds = recordIds.filter((id) => Types.ObjectId.isValid(id))
    if (validIds.length !== recordIds.length) {
      return res.status(400).json({
        success: false,
        message: "All recordIds must be valid ObjectIds",
      })
    }

    const deleteResult = await Model.deleteMany({ _id: { $in: validIds } })

    return res.status(200).json({
      success: true,
      message: `${deleteResult.deletedCount} ${dataType} records deleted successfully`,
      deletedCount: deleteResult.deletedCount,
    })
  } catch (error) {
    console.error("Error in bulkDeleteRecords:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to delete records",
      error: error.message,
    })
  }
}

// Get data statistics
export const getDataStatistics = async (req, res) => {
  try {
    const { userId, taxYear } = req.query

    const modelMap = getModelMap()
    const statistics = {}

    // Get count for each data type
    for (const [dataType, Model] of Object.entries(modelMap)) {
      try {
        const query = {}

        if (userId && dataType !== "servicecharges") {
          if (dataType === "familyaccounts") {
            query.mainUserId = userId
          } else if (dataType !== "users") {
            query.userId = userId
          } else {
            query._id = userId
          }
        }

        if (
          taxYear &&
          ![
            "users",
            "businessincorporations",
            "gstregistrations",
            "ntnregistrations",
            "irisprofiles",
            "documents",
            "servicecharges",
          ].includes(dataType)
        ) {
          query.taxYear = taxYear
        }

        const count = await Model.countDocuments(query)
        statistics[dataType] = count
      } catch (error) {
        statistics[dataType] = 0
      }
    }

    // Calculate totals
    const totals = {
      totalRecords: Object.values(statistics).reduce((sum, count) => sum + count, 0),
      incomeStreams: [
        "profitonsavings",
        "propertysaleincome",
        "rentincomes",
        "salaryincomes",
        "agricultureincomes",
        "businessincomes",
        "commissionserviceincomes",
        "dividendcapitalgainincomes",
        "freelancerincomes",
        "otherincomes",
        "partnershipaopincomes",
        "professionalservicesincomes",
      ].reduce((sum, type) => sum + (statistics[type] || 0), 0),

      assets: [
        "propertyassets",
        "vehicleassets",
        "bankaccountassets",
        "cashassets",
        "foreignassets",
        "insuranceassets",
        "otherassets",
        "possessionassets",
      ].reduce((sum, type) => sum + (statistics[type] || 0), 0),

      deductions: ["utilitydeductions", "vehicledeductions", "banktransactions", "otherdeductions"].reduce(
        (sum, type) => sum + (statistics[type] || 0),
        0,
      ),

      liabilities: ["bankloans", "otherliabilities", "expenses"].reduce(
        (sum, type) => sum + (statistics[type] || 0),
        0,
      ),
    }

    return res.status(200).json({
      success: true,
      message: "Data statistics fetched successfully",
      data: {
        statistics,
        totals,
        userId,
        taxYear,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in getDataStatistics:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch data statistics",
      error: error.message,
    })
  }
}

// Helper function to get model map
function getModelMap() {
  return {
    profitonsavings: ProfitOnSavings,
    propertyassets: PropertyAsset,
    propertysaleincome: PropertySaleIncome,
    rentincomes: RentIncome,
    salaryincomes: SalaryIncome,
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
}
