import OtherDeduction from '../../models/deduction/otherDeduction.js';

export const createOtherDeduction = async (req, res) => {
  try {
    const {
      userId,
      taxYear,
      propertyPurchase,  // ✅ Matches schema
      propertySale,     // ✅ Matches schema
      gatherings,       // ✅ Matches schema
      pensionWithdrawal // ✅ Matches schema
    } = req.body;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    const entry = new OtherDeduction({
      userId,
      taxYear,
      propertyPurchase: propertyPurchase || 0,  // Fallback to 0 if undefined
      propertySale: propertySale || 0,
      gatherings: gatherings || 0,
      pensionWithdrawal: pensionWithdrawal || 0
    });

    await entry.save();

    res.status(201).json({ message: 'Other deductions saved', data: entry });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Server error while saving other deductions' });
  }
};

export const getOtherDeductionByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;
    const data = await OtherDeduction.findOne({ userId, taxYear });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching other deductions' });
  }
};
