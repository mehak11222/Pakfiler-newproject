import express from 'express';
import { getAssetSummary } from '../../controllers/assetDetails/assetSummary.controller.js';

const router = express.Router();

router.get('/summary/:userId/:taxYear', getAssetSummary);

export default router;
