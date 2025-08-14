import PropertySaleIncome from '../../models/incomeDetails/propertySale.js';

export const createPropertySaleIncome = async (req, res) => {
  try {
    const { userId, taxYear, propertySales } = req.body;

    if (!userId || !taxYear || !Array.isArray(propertySales)) {
      return res.status(400).json({ error: 'userId, taxYear, and propertySales[] are required' });
    }

    const record = new PropertySaleIncome({ userId, taxYear, propertySales });
    await record.save();

    res.status(201).json({ message: 'Property sale income saved', data: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving property sale income' });
  }
};

export const getPropertySaleIncomeByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    const data = await PropertySaleIncome.findOne({ userId, taxYear });

    if (!data) return res.status(404).json({ error: 'No data found' });

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching property sale income' });
  }
};
