import ForeignAsset from '../../models/assetDetails/foreignAsset.model.js';

export const createForeignAsset = async (req, res) => {
  try {
    const { userId, taxYear, description, cost } = req.body;

    if (!userId || !taxYear || !description || cost === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const record = new ForeignAsset({ userId, taxYear, description, cost });
    await record.save();

    res.status(201).json({ message: 'Foreign asset saved', data: record });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getForeignAssetByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;
    const data = await ForeignAsset.find({ userId, taxYear });
    res.status(200).json(data);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
