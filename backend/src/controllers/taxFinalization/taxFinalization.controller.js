import TaxFinalization from '../../models/taxFinalization/taxFinalization.model.js';

export const finalizeTaxFiling = async (req, res) => {
  try {
    const { userId, taxYear, autoAdjustWealth, termsAccepted } = req.body;

    if (!userId || !taxYear || termsAccepted === undefined || autoAdjustWealth === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await TaxFinalization.findOne({ userId, taxYear });

    if (existing) {
      return res.status(409).json({ error: 'Tax filing already finalized for this year.' });
    }

    const record = new TaxFinalization({ userId, taxYear, autoAdjustWealth, termsAccepted });
    await record.save();

    res.status(201).json({ message: 'Tax filing finalized successfully', data: record });
  } catch (err) {
    console.error('Finalize Error:', err.message);
    res.status(500).json({ error: 'Server error during finalization' });
  }
};

export const getFinalizationStatus = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    const record = await TaxFinalization.findOne({ userId, taxYear });

    if (!record) {
      return res.status(404).json({ message: 'Not finalized yet' });
    }

    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
