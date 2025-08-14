import DividendCapitalGainIncome from '../../models/incomeDetails/dividend.js';

// Create or Save Dividend/Capital Gain Income
export const createDividendCapitalGainIncome = async (req, res) => {
  try {
    const { userId, taxYear, dividend, capitalGain, bonus } = req.body;

    if (!userId || !taxYear || !dividend || !capitalGain || !bonus) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const newEntry = new DividendCapitalGainIncome({
      userId,
      taxYear,
      dividend,
      capitalGain,
      bonus
    });

    await newEntry.save();
    res.status(201).json({ message: 'Dividend & Capital Gain Income saved successfully', data: newEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while saving data' });
  }
};

// Get Dividend/Capital Gain Income by userId & taxYear
export const getDividendCapitalGainIncomeByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    const data = await DividendCapitalGainIncome.findOne({ userId, taxYear });

    if (!data) {
      return res.status(404).json({ error: 'No data found' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching data' });
  }
};
