// controllers/wrapupController.js
import crypto from 'crypto';
import {
  User,
  TaxCredit,
  BankTransaction,
  UtilityDeduction,
  VehicleDeduction,
  OtherDeduction,
  Document,
  ServiceCharge,
  TaxFiling
} from '../../models/wrapUp/wrapup.model.js';

// Encryption functions
const encrypt = (text) => {
  const algorithm = 'aes-256-cbc';
  const key = process.env.ENCRYPTION_KEY || 'your-secret-key-32-characters!!';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

class WrapupController {
  // Get all users
  static async getAllUsers(req, res) {
    try {
      const users = await User.find().select('-password');
      res.json({
        message: 'Users fetched successfully',
        data: users
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get document summary
  static async getDocumentSummary(req, res) {
    try {
      const totalDocuments = await Document.countDocuments();
      const ntnDocs = await Document.countDocuments({ module: 'ntn' });
      const businessDocs = await Document.countDocuments({ module: 'business' });
      const gstDocs = await Document.countDocuments({ module: 'gst' });

      res.json({
        success: true,
        userId: req.user?.id || 'system',
        userRole: req.user?.role || 'user',
        totalDocuments,
        moduleBreakdown: {
          ntn: ntnDocs,
          businessIncorporation: businessDocs,
          gst: gstDocs
        },
        timestamps: {
          requestedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all documents with pagination
  static async getAllDocuments(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const documents = await Document.find()
        .populate('user', 'fullName email cnic')
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalDocuments = await Document.countDocuments();
      const totalPages = Math.ceil(totalDocuments / limit);

      const stats = {
        total: totalDocuments,
        approved: await Document.countDocuments({ status: 'approved' }),
        pending: await Document.countDocuments({ status: 'pending' }),
        rejected: await Document.countDocuments({ status: 'rejected' }),
        underReview: await Document.countDocuments({ status: 'underReview' }),
        moduleBreakdown: {
          ntn: await Document.countDocuments({ module: 'ntn' }),
          business: await Document.countDocuments({ module: 'business' }),
          gst: await Document.countDocuments({ module: 'gst' })
        },
        totalUsers: await User.countDocuments()
      };

      res.json({
        success: true,
        message: 'Documents fetched successfully',
        data: {
          documents,
          pagination: {
            currentPage: page,
            totalPages,
            totalDocuments,
            documentsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          },
          statistics: stats,
          filters: {
            search: req.query.search || '',
            module: req.query.module || '',
            status: req.query.status || '',
            appliedFilters: {
              searchApplied: !!req.query.search,
              moduleFilter: req.query.module || '',
              statusFilter: req.query.status || '',
              dateFilter: false
            }
          }
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get service charges
  static async getServiceCharges(req, res) {
    try {
      const serviceCharges = await ServiceCharge.find();
      res.json({
        success: true,
        data: serviceCharges
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get tax credit
  static async getTaxCredit(req, res) {
    try {
      const { userId, taxYear } = req.query;
      
      if (!userId || !taxYear) {
        return res.status(400).json({ message: 'userId and taxYear are required' });
      }

      const taxCredit = await TaxCredit.findOne({ userId, taxYear });
      
      if (!taxCredit) {
        return res.status(404).json({ message: 'Tax credit data not found' });
      }

      res.json(taxCredit);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Create/Update tax credit
  static async createTaxCredit(req, res) {
    try {
      const { userId, taxYear, donationAmount, pensionFundInvestment, tuitionFee } = req.body;

      const taxCredit = await TaxCredit.findOneAndUpdate(
        { userId, taxYear },
        { donationAmount, pensionFundInvestment, tuitionFee },
        { upsert: true, new: true }
      );

      res.json(taxCredit);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get deduction summary
  static async getDeductionSummary(req, res) {
    try {
      const { userId, taxYear } = req.params;

      const [bankTransactions, utilityDeductions, vehicleDeductions, otherDeductions] = await Promise.all([
        BankTransaction.find({ userId, taxYear }),
        UtilityDeduction.find({ userId, taxYear }),
        VehicleDeduction.find({ userId, taxYear }),
        OtherDeduction.findOne({ userId, taxYear })
      ]);

      res.json({
        message: 'Tax deduction summary fetched successfully',
        data: {
          bankTransactions,
          utilityDeductions,
          vehicleDeductions,
          otherDeductions: otherDeductions || {}
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Create bank transaction
  static async createBankTransaction(req, res) {
    try {
      const bankTransaction = new BankTransaction(req.body);
      await bankTransaction.save();
      res.status(201).json(bankTransaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Create utility deduction
  static async createUtilityDeduction(req, res) {
    try {
      const utilityDeduction = new UtilityDeduction(req.body);
      await utilityDeduction.save();
      res.status(201).json(utilityDeduction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Create vehicle deduction
  static async createVehicleDeduction(req, res) {
    try {
      const vehicleDeduction = new VehicleDeduction(req.body);
      await vehicleDeduction.save();
      res.status(201).json(vehicleDeduction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Create/Update other deduction
  static async createOtherDeduction(req, res) {
    try {
      const { userId, taxYear } = req.body;
      const otherDeduction = await OtherDeduction.findOneAndUpdate(
        { userId, taxYear },
        req.body,
        { upsert: true, new: true }
      );
      res.json(otherDeduction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Submit tax filing
  static async submitTaxFiling(req, res) {
    try {
      const { userId, taxYear, formData, fbrCredentials } = req.body;
      
      const taxFilingData = {
        userId,
        taxYear,
        formData: typeof formData === 'string' ? JSON.parse(formData) : formData,
        status: 'submitted',
        submittedAt: new Date()
      };

      // Handle FBR credentials if provided
      if (fbrCredentials) {
        const credentials = typeof fbrCredentials === 'string' ? JSON.parse(fbrCredentials) : fbrCredentials;
        const { fbrPassword, fbrPin } = credentials;
        taxFilingData.fbrCredentials = {
          fbrPassword: encrypt(fbrPassword),
          fbrPin: encrypt(fbrPin)
        };
      }

      // Handle CNIC file uploads
      if (req.files && req.files.length > 0) {
        taxFilingData.cnicFiles = req.files.map(file => file.path);
      }

      const taxFiling = new TaxFiling(taxFilingData);
      await taxFiling.save();

      res.json({
        success: true,
        message: 'Tax filing submitted successfully',
        data: taxFiling
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update NTN cart status
  static async updateNTNCart(req, res) {
    try {
      const { id } = req.params;
      const { addNTNToCart } = req.body;

      const taxFiling = await TaxFiling.findByIdAndUpdate(
        id,
        { addNTNToCart },
        { new: true }
      );

      if (!taxFiling) {
        return res.status(404).json({ success: false, message: 'Tax filing not found' });
      }

      res.json({
        success: true,
        message: 'NTN cart status updated',
        data: taxFiling
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get tax filing by ID
  static async getTaxFiling(req, res) {
    try {
      const taxFiling = await TaxFiling.findById(req.params.id)
        .populate('userId', 'fullName email cnic phone');
      
      if (!taxFiling) {
        return res.status(404).json({ success: false, message: 'Tax filing not found' });
      }

      res.json({
        success: true,
        data: taxFiling
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default WrapupController;