import AssetSelection from '../../models/assetSelection/assetSelection.model.js';

export const saveAssetSelection = async (req, res) => {
  try {
    const {
      userId,
      taxYear,
      properties,
      vehicles,
      bankAccounts,
      insurances,
      possessions,
      foreignAssets,
      cash,
      otherAssets
    } = req.body;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    // Check if already exists
    let record = await AssetSelection.findOne({ userId, taxYear });

    if (record) {
      Object.assign(record, {
        properties,
        vehicles,
        bankAccounts,
        insurances,
        possessions,
        foreignAssets,
        cash,
        otherAssets
      });
      await record.save();
    } else {
      record = new AssetSelection({
        userId,
        taxYear,
        properties,
        vehicles,
        bankAccounts,
        insurances,
        possessions,
        foreignAssets,
        cash,
        otherAssets
      });
      await record.save();
    }

    res.status(200).json({ message: 'Asset selection saved', data: record });
  } catch (error) {
    console.error('❌ Error saving asset selection:', error.message);
    res.status(500).json({ error: 'Server error while saving asset selection' });
  }
};

export const getAssetSelection = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    const data = await AssetSelection.findOne({ userId, taxYear });
    if (!data) return res.status(404).json({ error: 'No data found' });

    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error fetching asset selection:', error.message);
    res.status(500).json({ error: 'Server error while fetching asset selection' });
  }
};
