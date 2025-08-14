import AgricultureIncome from '../../models/incomeDetails/agriculture.js';

// Create Agriculture Income Entry
export const createAgricultureIncome = async (req, res) => {
  try {
    const { userId, taxYear, annualIncome } = req.body;

    if (!userId || !taxYear || annualIncome === undefined) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const newEntry = new AgricultureIncome({
      userId,
      taxYear,
      annualIncome,
    });

    await newEntry.save();

    res.status(201).json({ message: 'Agriculture income saved successfully', data: newEntry });
  } catch (error) {
    res.status(500).json({ error: 'Server error while saving agriculture income' });
  }
};

// Get Agriculture Income for a User
export const getAgricultureIncomeByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    const data = await AgricultureIncome.findOne({ userId, taxYear });

    if (!data) return res.status(404).json({ error: 'No data found for user' });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching agriculture income' });
  }
};
