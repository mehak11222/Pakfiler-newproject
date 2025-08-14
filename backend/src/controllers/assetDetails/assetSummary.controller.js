import Property from '../../models/assetDetails/propertyAsset.model.js';
import Vehicle from '../../models/assetDetails/vehicle.model.js';
import BankAccount from '../../models/assetDetails/bankAccount.model.js';
import Insurance from '../../models/assetDetails/insurance.model.js';
import OtherAsset from '../../models/assetDetails/otherAsset.model.js';
import Cash from '../../models/assetDetails/cash.model.js';
import ForeignAsset from '../../models/assetDetails/foreignAsset.model.js';
import Possession from '../../models/assetDetails/possession.model.js';

export const getAssetSummary = async (req, res) => {
  const { userId, taxYear } = req.params;

  try {
    const [properties, vehicles, bankAccounts, insurances, otherAssets, cash, foreignAssets, possessions] =
      await Promise.all([
        Property.find({ userId, taxYear }),
        Vehicle.find({ userId, taxYear }),
        BankAccount.find({ userId, taxYear }),
        Insurance.find({ userId, taxYear }),
        OtherAsset.find({ userId, taxYear }),
        Cash.findOne({ userId, taxYear }),
        ForeignAsset.find({ userId, taxYear }),
        Possession.find({ userId, taxYear })
      ]);

    res.status(200).json({
      message: 'Asset summary fetched successfully',
      data: {
        properties,
        vehicles,
        bankAccounts,
        insurances,
        otherAssets,
        cash: cash || {},
        foreignAssets,
        possessions
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch asset summary',
      error: error.message
    });
  }
};
