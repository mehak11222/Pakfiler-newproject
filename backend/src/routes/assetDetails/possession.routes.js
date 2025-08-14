import express from 'express';
import { createPossession, getPossessionByUser } from '../../controllers/assetDetails/possession.controller.js';

const router = express.Router();
router.post('/possession', createPossession);
router.get('/possession', getPossessionByUser);

export default router;
