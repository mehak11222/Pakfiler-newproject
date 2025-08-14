import express from 'express';
import { createForeignAsset, getForeignAssetByUser } from '../../controllers/assetDetails/foreignAsset.controller.js';

const router = express.Router();
router.post('/foreign-asset', createForeignAsset);
router.get('/foreign-asset', getForeignAssetByUser);

export default router;
