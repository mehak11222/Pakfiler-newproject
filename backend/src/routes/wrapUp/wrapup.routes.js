// routes/index.js
import express from 'express';
import multer from 'multer';
import WrapupController from '../../controllers/wrapUp/wrapup.controller.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cnic/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// User routes
router.get('/api/user/all', WrapupController.getAllUsers);

// Document routes
router.get('/api/documents/summary', WrapupController.getDocumentSummary);
router.get('/api/admin/documents', WrapupController.getAllDocuments);

// Service charge routes
router.get('/api/service-charge', WrapupController.getServiceCharges);

// Tax credit routes
router.get('/api/tax-credit', WrapupController.getTaxCredit);
router.post('/api/tax-credit', WrapupController.createTaxCredit);

// Deduction routes
router.get('/api/deduction/summary/:userId/:taxYear', WrapupController.getDeductionSummary);
router.post('/api/deduction/bank-transaction', WrapupController.createBankTransaction);
router.post('/api/deduction/utility', WrapupController.createUtilityDeduction);
router.post('/api/deduction/vehicle', WrapupController.createVehicleDeduction);
router.post('/api/deduction/other', WrapupController.createOtherDeduction);

// Tax filing routes
router.post('/api/tax-filing/submit', upload.array('cnicFiles', 2), WrapupController.submitTaxFiling);
router.put('/api/tax-filing/:id/ntn-cart', WrapupController.updateNTNCart);
router.get('/api/tax-filing/:id', WrapupController.getTaxFiling);

export default router;