import OtherAsset from '../../models/assetDetails/otherAsset.model.js';

export const createOtherAsset = async (req, res) => {
  try {
    const { userId, taxYear, transactionType, description, amount } = req.body;

    if (!userId || !taxYear || !transactionType || !description || amount === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const record = new OtherAsset({ userId, taxYear, transactionType, description, amount });
    await record.save();

    res.status(201).json({ message: 'Other asset saved', data: record });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getOtherAssetByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;
    const data = await OtherAsset.find({ userId, taxYear });
    res.status(200).json(data);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
