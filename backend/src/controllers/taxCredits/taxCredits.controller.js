import TaxCredit from '../../models/taxCredits/taxCredits.js';

// Create or Update Tax Credit
export const upsertTaxCredit = async (req, res) => {
  try {
    const { userId, taxYear, donationAmount, pensionFundInvestment, tuitionFee } = req.body;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    const updated = await TaxCredit.findOneAndUpdate(
      { userId, taxYear },
      { $set: { donationAmount, pensionFundInvestment, tuitionFee } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Tax credit saved/updated successfully', data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving tax credit' });
  }
};

// Get Tax Credit
export const getTaxCreditByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    const data = await TaxCredit.findOne({ userId, taxYear });

    if (!data) return res.status(404).json({ error: 'No tax credit data found' });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving tax credit' });
  }
};