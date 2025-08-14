import express from 'express';
import {
  submitPersonalInfo,
  submitEmployerInfo,
  getIRISProfile
} from '../../controllers/irisProfile/irisProfile.controller.js';
import { verifyUser } from '../../middlewares/verifyUser.js';

const router = express.Router();

router.post('/personal-info', verifyUser, submitPersonalInfo);
router.post('/employer-info', verifyUser, submitEmployerInfo);
router.get('/', verifyUser, getIRISProfile);

export default router;
