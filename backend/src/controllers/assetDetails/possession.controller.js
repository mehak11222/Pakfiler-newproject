import PossessionAsset from '../../models/assetDetails/possession.model.js';

export const createPossession = async (req, res) => {
  try {
    const { userId, taxYear, possessionType, description, cost } = req.body;

    if (!userId || !taxYear || !possessionType || !description || cost === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const record = new PossessionAsset({ userId, taxYear, possessionType, description, cost });
    await record.save();

    res.status(201).json({ message: 'Possession saved', data: record });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPossessionByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;
    const data = await PossessionAsset.find({ userId, taxYear });
    res.status(200).json(data);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
