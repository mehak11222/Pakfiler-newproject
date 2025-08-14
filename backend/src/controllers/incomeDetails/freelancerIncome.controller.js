import FreelancerIncome from '../../models/incomeDetails/freelancerIncome.model.js';

export const createFreelancerIncome = async (req, res) => {
  try {
    const { userId, taxYear, totalEarnings, expenses, netIncome, taxPaid, fromAbroad } = req.body;

    const record = new FreelancerIncome({ userId, taxYear, totalEarnings, expenses, netIncome, taxPaid, fromAbroad });
    await record.save();

    res.status(201).json({ message: 'Freelancer income saved', data: record });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getFreelancerIncomeByUser = async (req, res) => {
  const { userId, taxYear } = req.query;
  const data = await FreelancerIncome.findOne({ userId, taxYear });
  if (!data) return res.status(404).json({ error: 'No data found' });
  res.json(data);
};
