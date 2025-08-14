import InsuranceAsset from '../../models/assetDetails/insurance.model.js';

export const createInsurance = async (req, res) => {
  try {
    const { userId, taxYear, companyName, description, premiumPaid } = req.body;

    if (!userId || !taxYear || !companyName || !description || premiumPaid === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const record = new InsuranceAsset({ userId, taxYear, companyName, description, premiumPaid });
    await record.save();

    res.status(201).json({ message: 'Insurance saved', data: record });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getInsuranceByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;
    const data = await InsuranceAsset.find({ userId, taxYear });
    res.status(200).json(data);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
