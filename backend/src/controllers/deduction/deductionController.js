import BankTransaction from '../../models/deduction/bankTransaction.js';
import UtilityDeduction from '../../models/deduction/utilityDeduction.js';
import VehicleDeduction from '../../models/deduction/vehicleDeduction.js';
import OtherDeduction from '../../models/deduction/otherDeduction.js';

export const getDeductionSummary = async (req, res) => {
  const { userId, taxYear } = req.params;

  try {
    const bankTransactions = await BankTransaction.find({ userId, taxYear });
    const utilityDeductions = await UtilityDeduction.find({ userId, taxYear });
    const vehicleDeductions = await VehicleDeduction.find({ userId, taxYear });
    const otherDeduction = await OtherDeduction.findOne({ userId, taxYear });

    res.status(200).json({
      message: 'Tax deduction summary fetched successfully',
      data: {
        bankTransactions,
        utilityDeductions,
        vehicleDeductions,
        otherDeductions: otherDeduction || {}
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch tax deduction summary',
      error: error.message
    });
  }
};
