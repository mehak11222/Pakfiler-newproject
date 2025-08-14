import PartnershipAOPIncome from '../../models/incomeDetails/partnership.js';

export const createPartnershipAOPIncome = async (req, res) => {
  try {
    const { userId, taxYear, partnerships } = req.body;
    const record = new PartnershipAOPIncome({ userId, taxYear, partnerships });
    await record.save();
    res.status(201).json({ message: 'Partnership/AOP income saved', data: record });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPartnershipAOPIncomeByUser = async (req, res) => {
  const { userId, taxYear } = req.query;
  const data = await PartnershipAOPIncome.findOne({ userId, taxYear });
  if (!data) return res.status(404).json({ error: 'No data found' });
  res.json(data);
};
