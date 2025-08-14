import Expense from '../../models/expense/expense.model.js';

export const createOrUpdateExpense = async (req, res) => {
  try {
    const { userId, taxYear, ...fields } = req.body;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    let existing = await Expense.findOne({ userId, taxYear });

    if (existing) {
      Object.assign(existing, fields); // update with all provided fields
      await existing.save();
      return res.status(200).json({ message: 'Expense updated', data: existing });
    }

    const record = new Expense({ userId, taxYear, ...fields });
    await record.save();

    res.status(201).json({ message: 'Expense created', data: record });
  } catch (err) {
    console.error('Expense Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getExpenseByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'Missing userId or taxYear' });
    }

    const data = await Expense.findOne({ userId, taxYear });
    res.status(200).json(data);
  } catch (err) {
    console.error('Expense Fetch Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
