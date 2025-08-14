import UtilityDeduction from '../../models/deduction/utilityDeduction.js';

export const createUtilityDeduction = async (req, res) => {
  try {
    const { userId, taxYear, utilityType, provider, consumerNumber, taxDeducted } = req.body;

    if (!userId || !taxYear || !utilityType || !provider || !consumerNumber || taxDeducted === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const entry = new UtilityDeduction({ userId, taxYear, utilityType, provider, consumerNumber, taxDeducted });
    await entry.save();

    res.status(201).json({ message: 'Utility deduction saved', data: entry });
  } catch (error) {
    res.status(500).json({ error: 'Server error while saving utility deduction' });
  }
};

export const getUtilityDeductionsByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;
    const data = await UtilityDeduction.find({ userId, taxYear });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching utility deductions' });
  }
};
