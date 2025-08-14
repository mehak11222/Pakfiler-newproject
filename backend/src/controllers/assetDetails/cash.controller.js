import CashAsset from '../../models/assetDetails/cash.model.js';

export const createCash = async (req, res) => {
  try {
    const { userId, taxYear, balance } = req.body;

    if (!userId || !taxYear || balance === undefined) {
      return res.status(400).json({ error: 'userId, taxYear, and balance are required' });
    }

    // Upsert logic: one cash record per user per tax year
    let record = await CashAsset.findOne({ userId, taxYear });

    if (record) {
      record.balance = balance;
      await record.save();
    } else {
      record = new CashAsset({ userId, taxYear, balance });
      await record.save();
    }

    res.status(201).json({ message: 'Cash balance saved', data: record });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCashByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;
    const data = await CashAsset.findOne({ userId, taxYear });

    if (!data) {
      return res.status(404).json({ error: 'No cash record found' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
