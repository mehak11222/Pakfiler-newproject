import express from 'express';
import {
  createPropertyAsset,
  getPropertyAssetsByUser
} from '../../controllers/assetDetails/propertyAsset.controller.js';

const router = express.Router();

router.post('/property', createPropertyAsset);
router.get('/property', getPropertyAssetsByUser);

export default router;
