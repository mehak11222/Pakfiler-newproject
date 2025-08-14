import express from 'express';
import { createOtherAsset, getOtherAssetByUser } from '../../controllers/assetDetails/otherAsset.controller.js';

const router = express.Router();
router.post('/other-asset', createOtherAsset);
router.get('/other-asset', getOtherAssetByUser);

export default router;
