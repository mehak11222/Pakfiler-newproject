import OtherIncome from '../../models/incomeDetails/otherIncome.js';

export const createOtherIncome = async (req, res) => {
  try {
    const { userId, taxYear, inflows } = req.body;
    const record = new OtherIncome({ userId, taxYear, inflows });
    await record.save();
    res.status(201).json({ message: 'Other income saved', data: record });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getOtherIncomeByUser = async (req, res) => {
  const { userId, taxYear } = req.query;
  const data = await OtherIncome.findOne({ userId, taxYear });
  if (!data) return res.status(404).json({ error: 'No data found' });
  res.json(data);
};
