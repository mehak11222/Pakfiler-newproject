import PropertyAsset from '../../models/assetDetails/propertyAsset.model.js';

export const createPropertyAsset = async (req, res) => {
  try {
    const {
      userId,
      taxYear,
      propertyType,
      size,
      unitType,
      address,
      fbrValue,
      cost
    } = req.body;

    if (!userId || !taxYear || !propertyType || !size || !unitType || !address || fbrValue === undefined || cost === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const asset = new PropertyAsset({
      userId,
      taxYear,
      propertyType,
      size,
      unitType,
      address,
      fbrValue,
      cost
    });

    await asset.save();
    res.status(201).json({ message: 'Property asset saved', data: asset });

  } catch (error) {
    console.error("❌ Error saving property asset:", error.message);
    res.status(500).json({ error: 'Server error while saving property asset' });
  }
};

export const getPropertyAssetsByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;

    if (!userId || !taxYear) {
      return res.status(400).json({ error: 'userId and taxYear are required' });
    }

    const assets = await PropertyAsset.find({ userId, taxYear });
    res.status(200).json(assets);
  } catch (error) {
    console.error("❌ Error fetching property assets:", error.message);
    res.status(500).json({ error: 'Server error while fetching property assets' });
  }
};
