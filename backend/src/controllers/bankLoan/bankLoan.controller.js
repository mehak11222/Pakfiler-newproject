import BankLoan from '../../models/bankLoan/bankLoan.model.js';

export const createBankLoan = async (req, res) => {
  try {
    const { userId, taxYear, bankName, outstandingLoan } = req.body;

    if (!userId || !taxYear || !bankName || outstandingLoan === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const record = new BankLoan({ userId, taxYear, bankName, outstandingLoan });
    await record.save();

    res.status(201).json({ message: 'Bank loan saved', data: record });
  } catch (err) {
    console.error('Bank Loan Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getBankLoansByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;
    const data = await BankLoan.find({ userId, taxYear });
    res.status(200).json(data);
  } catch (err) {
    console.error('Bank Loan Fetch Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
