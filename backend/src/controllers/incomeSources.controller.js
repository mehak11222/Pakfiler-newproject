// controllers/incomeSources.controller.js
import IncomeSources from '../models/incomeSources.model.js';

export const createIncomeSources = async (req, res) => {
  try {
    const { userId, taxYear, selectedSources } = req.body;

    if (!userId || !taxYear || !selectedSources) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newEntry = new IncomeSources({
      userId,
      taxYear,
      selectedSources,
    });

    await newEntry.save();

    res.status(201).json({ message: 'Income sources saved successfully', data: newEntry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while saving income sources' });
  }
};

export const getIncomeSourcesByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    const data = await IncomeSources.findOne({ userId, taxYear });

    if (!data) return res.status(404).json({ error: 'No income sources found' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error while retrieving data' });
  }
};
