import ProfessionalServicesIncome from '../../models/incomeDetails/professionalServices.model.js';

export const createProfessionalServicesIncome = async (req, res) => {
  try {
    const { userId, taxYear, professionType, amount, expenses, taxPaid } = req.body;
    const record = new ProfessionalServicesIncome({ userId, taxYear, professionType, amount, expenses, taxPaid });
    await record.save();
    res.status(201).json({ message: 'Professional service income saved', data: record });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProfessionalServicesIncomeByUser = async (req, res) => {
  const { userId, taxYear } = req.query;
  const data = await ProfessionalServicesIncome.findOne({ userId, taxYear });
  if (!data) return res.status(404).json({ error: 'No data found' });
  res.json(data);
};
