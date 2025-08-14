import ProfitOnSavings from '../../models/incomeDetails/profitOnSavings.model.js';

export const createProfitOnSavings = async (req, res) => {
  try {
    const { userId, taxYear, bankDeposit, govtScheme, behbood, pensionerBenefit } = req.body;
    const record = new ProfitOnSavings({ userId, taxYear, bankDeposit, govtScheme, behbood, pensionerBenefit });
    await record.save();
    res.status(201).json({ message: 'Profit on savings recorded', data: record });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProfitOnSavingsByUser = async (req, res) => {
  const { userId, taxYear } = req.query;
  const data = await ProfitOnSavings.findOne({ userId, taxYear });
  if (!data) return res.status(404).json({ error: 'No data found' });
  res.json(data);
};
