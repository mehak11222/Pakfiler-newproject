import PersonalInfo from '../../models/PersonalInfo.js';
import IncomeSource from '../../models/incomeSources.model.js';
import TaxCredit from '../../models/taxCredits/taxCredits.js';
import OpeningWealth from '../../models/openingWealth/openingWealth.model.js';
import AssetSelection from '../../models/assetSelection/assetSelection.model.js';
import Expense from '../../models/expense/expense.model.js';
import BankLoan from '../../models/bankLoan/bankLoan.model.js';
import OtherLiability from '../../models/bankLoan/otherLiability.model.js';
import BankAccount from '../../models/assetDetails/bankAccount.model.js';
import PropertyAsset from '../../models/assetDetails/propertyAsset.model.js';
import VehicleAsset from '../../models/assetDetails/vehicle.model.js';
import CashAsset from '../../models/assetDetails/cash.model.js';
import Possession from '../../models/assetDetails/possession.model.js';
import Insurance from '../../models/assetDetails/insurance.model.js';
import ForeignAsset from '../../models/assetDetails/foreignAsset.model.js';
import OtherAsset from '../../models/assetDetails/otherAsset.model.js';
import TaxFiling from '../../models/TaxFiling/TaxFiling.js';

export const getTaxFilingSummary = async (req, res) => {
  const { userId, taxYear } = req.params;

  try {
    const summary = {};

    summary.personalInfo = await PersonalInfo.findOne({ userId, taxYear });
    summary.incomeSources = await IncomeSource.find({ userId, taxYear });
    summary.taxCredits = await TaxCredit.findOne({ userId, taxYear });
    summary.openingWealth = await OpeningWealth.findOne({ userId, taxYear });
    summary.assetSelection = await AssetSelection.findOne({ userId, taxYear });
    summary.expense = await Expense.findOne({ userId, taxYear });
    summary.bankLoans = await BankLoan.find({ userId, taxYear });
    summary.otherLiabilities = await OtherLiability.find({ userId, taxYear });

    // Asset details
    summary.bankAccounts = await BankAccount.find({ userId, taxYear });
    summary.properties = await PropertyAsset.find({ userId, taxYear });
    summary.vehicles = await VehicleAsset.find({ userId, taxYear });
    summary.cash = await CashAsset.find({ userId, taxYear });
    summary.possessions = await Possession.find({ userId, taxYear });
    summary.insurances = await Insurance.find({ userId, taxYear });
    summary.foreignAssets = await ForeignAsset.find({ userId, taxYear });
    summary.otherAssets = await OtherAsset.find({ userId, taxYear });

    summary.taxFilingMeta = await TaxFiling.findOne({ userId, taxYear });

    res.status(200).json({
      message: 'Tax filing summary retrieved successfully',
      data: summary
    });
  } catch (err) {
    console.error('Error fetching tax filing summary:', err);
    res.status(500).json({
      message: 'Failed to fetch tax filing summary',
      error: err.message
    });
  }
};
