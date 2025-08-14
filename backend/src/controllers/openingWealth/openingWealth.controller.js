import OpeningWealth from '../../models/openingWealth/openingWealth.model.js';

export const saveOpeningWealth = async (req, res) => {
  try {
    const { userId, taxYear, openingWealth } = req.body;

    if (!userId || !taxYear || openingWealth === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if already exists
    let record = await OpeningWealth.findOne({ userId, taxYear });

    if (record) {
      record.openingWealth = openingWealth;
      await record.save();
    } else {
      record = new OpeningWealth({ userId, taxYear, openingWealth });
      await record.save();
    }

    res.status(200).json({ message: 'Opening wealth saved', data: record });
  } catch (error) {
    console.error('❌ Error saving opening wealth:', error.message);
    res.status(500).json({ error: 'Server error while saving opening wealth' });
  }
};

export const getOpeningWealth = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    const record = await OpeningWealth.findOne({ userId, taxYear });

    if (!record) return res.status(404).json({ error: 'No data found' });

    res.status(200).json(record);
  } catch (error) {
    console.error('❌ Error fetching opening wealth:', error.message);
    res.status(500).json({ error: 'Server error while fetching opening wealth' });
  }
};
