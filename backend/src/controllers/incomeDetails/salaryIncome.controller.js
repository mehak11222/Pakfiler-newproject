import SalaryIncome from '../../models/incomeDetails/salaryIncome.model.js';

export const createSalaryIncome = async (req, res) => {
  try {
    const {
      userId,
      taxYear,
      annualSalary,
      taxDeducted,
      taDaReceived,
      medicalProvided,
      providentFund,
      vehicleProvided,
      vehicleAfterJune2020,
      vehicleCost,
      otherAllowances,
      gratuityFundWithdrawal,
      taxBorneByEmployer
    } = req.body;

    const record = new SalaryIncome({
      userId,
      taxYear,
      annualSalary,
      taxDeducted,
      taDaReceived,
      medicalProvided,
      providentFund,
      vehicleProvided,
      vehicleAfterJune2020,
      vehicleCost,
      otherAllowances,
      gratuityFundWithdrawal,
      taxBorneByEmployer
    });

    await record.save();
    res.status(201).json({ message: 'Salary income saved', data: record });

  } catch (err) {
    console.error("❌ Salary income save error:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSalaryIncomeByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    const data = await SalaryIncome.findOne({ userId, taxYear });
    if (!data) return res.status(404).json({ error: 'No data found' });

    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching salary income:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
