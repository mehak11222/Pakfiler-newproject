import OtherLiability from '../../models/bankLoan/otherLiability.model.js';

export const createOtherLiability = async (req, res) => {
  try {
    const { userId, taxYear, liabilityType, amount, description } = req.body;

    if (!userId || !taxYear || !liabilityType || amount === undefined || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const record = new OtherLiability({ userId, taxYear, liabilityType, amount, description });
    await record.save();

    res.status(201).json({ message: 'Other liability saved', data: record });
  } catch (err) {
    console.error('Other Liability Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getOtherLiabilitiesByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;
    const data = await OtherLiability.find({ userId, taxYear });
    res.status(200).json(data);
  } catch (err) {
    console.error('Other Liability Fetch Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
