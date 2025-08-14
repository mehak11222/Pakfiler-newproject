import express from 'express';
import {
  saveAssetSelection,
  getAssetSelection
} from '../../controllers/assetSelection/assetSelection.controller.js';

const router = express.Router();

router.post('/asset-selection', saveAssetSelection);
router.get('/asset-selection', getAssetSelection);

export default router;
