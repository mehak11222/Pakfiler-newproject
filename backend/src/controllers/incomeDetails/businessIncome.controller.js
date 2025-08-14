import BusinessIncome from '../../models/incomeDetails/businessIncome.model.js';

// Create Business Income Entry
export const createBusinessIncome = async (req, res) => {
  try {
    const { userId, taxYear, businessTypes } = req.body;

    if (!userId || !taxYear || !Array.isArray(businessTypes)) {
      return res.status(400).json({ error: 'userId, taxYear, and businessTypes[] are required' });
    }

    const newEntry = new BusinessIncome({
      userId,
      taxYear,
      businessTypes
    });

    await newEntry.save();

    res.status(201).json({ message: 'Business income saved successfully', data: newEntry });
  } catch (error) {
    res.status(500).json({ error: 'Server error while saving business income' });
  }
};

// Get Business Income Entry
export const getBusinessIncomeByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    const data = await BusinessIncome.findOne({ userId, taxYear });

    if (!data) return res.status(404).json({ error: 'No data found' });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching business income' });
  }
};
