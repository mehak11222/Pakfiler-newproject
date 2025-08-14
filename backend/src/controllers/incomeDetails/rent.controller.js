import RentIncome from '../../models/incomeDetails/rent.js';

export const createRentIncome = async (req, res) => {
  try {
    const { userId, taxYear, rentReceived, rentExpense, taxDeducted, tenantDeductedTax } = req.body;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    const record = new RentIncome({
      userId,
      taxYear,
      rentReceived,
      rentExpense,
      taxDeducted,
      tenantDeductedTax
    });

    await record.save();
    res.status(201).json({ message: 'Rent income saved', data: record });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while saving rent income' });
  }
};

export const getRentIncomeByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    const data = await RentIncome.findOne({ userId, taxYear });

    if (!data) return res.status(404).json({ error: 'No data found' });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching rent income' });
  }
};
