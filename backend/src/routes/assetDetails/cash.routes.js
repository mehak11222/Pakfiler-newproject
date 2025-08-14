import express from 'express';
import { createCash, getCashByUser } from '../../controllers/assetDetails/cash.controller.js';

const router = express.Router();
router.post('/cash', createCash);
router.get('/cash', getCashByUser);

export default router;
