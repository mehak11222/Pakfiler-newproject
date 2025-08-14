import CommissionServiceIncome from '../../models/incomeDetails/commission.js';

// Create Commission/Service Income Entry
export const createCommissionServiceIncome = async (req, res) => {
  try {
    const {
      userId,
      taxYear,
      lifeInsuranceAgent,
      generalInsuranceAgent,
      realEstateAgent,
      servicesConsultancy,
      otherCommissions
    } = req.body;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    const entry = new CommissionServiceIncome({
      userId,
      taxYear,
      lifeInsuranceAgent,
      generalInsuranceAgent,
      realEstateAgent,
      servicesConsultancy,
      otherCommissions
    });

    await entry.save();
    res.status(201).json({ message: 'Commission/Service income saved successfully', data: entry });
  } catch (err) {
    res.status(500).json({ error: 'Server error while saving commission/service income' });
  }
};

// Get Commission/Service Income Entry
export const getCommissionServiceIncomeByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    const data = await CommissionServiceIncome.findOne({ userId, taxYear });

    if (!data) return res.status(404).json({ error: 'No data found' });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching commission/service income' });
  }
};
