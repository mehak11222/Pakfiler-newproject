import BankTransaction from '../../models/deduction/bankTransaction.js';

export const createBankTransaction = async (req, res) => {
  try {
    const { userId, taxYear, transactionType, bankName, accountNumber, taxDeducted } = req.body;

    console.log('[Incoming Data]', req.body);

    if (!userId || !taxYear || !transactionType || !bankName || !accountNumber || taxDeducted === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const entry = new BankTransaction({ userId, taxYear, transactionType, bankName, accountNumber, taxDeducted });
    await entry.save();

    res.status(201).json({ message: 'Bank transaction saved', data: entry });
  } catch (error) {
    console.error('[BankTransaction Error]', error);
    res.status(500).json({ error: 'Server error while saving bank transaction' });
  }
};


export const getBankTransactionsByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;
    const data = await BankTransaction.find({ userId, taxYear });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching bank transactions' });
  }
};
