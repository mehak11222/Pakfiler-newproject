import BankAccountAsset from '../../models/assetDetails/bankAccount.model.js';

export const createBankAccount = async (req, res) => {
  try {
    const { userId, taxYear, bankName, accountNumber, balance } = req.body;

    if (!userId || !taxYear || !bankName || !accountNumber || balance === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const record = new BankAccountAsset({ userId, taxYear, bankName, accountNumber, balance });
    await record.save();

    res.status(201).json({ message: 'Bank account saved', data: record });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getBankAccountByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;
    const data = await BankAccountAsset.find({ userId, taxYear });
    res.status(200).json(data);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
