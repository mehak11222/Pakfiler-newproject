import NTNModel from '../../models/ntnRegistration/ntnRegistration.model.js';
import BusinessModel from '../../models/businessIncorporation/businessIncorporation.model.js';
import GSTModel from '../../models/gst/gstRegistration.model.js';
import { Types } from 'mongoose';

// 🔁 Utility to resolve correct userId
const resolveUserId = (req) => {
  const { role, _id: tokenUserId } = req.user;
  const queryUserId = req.query.userId;

  if (role === 'admin' && queryUserId && Types.ObjectId.isValid(queryUserId)) {
    return new Types.ObjectId(queryUserId);
  }

  if (!Types.ObjectId.isValid(tokenUserId)) {
    return null;
  }

  return new Types.ObjectId(tokenUserId);
};

export const getDocumentSummary = async (req, res) => {
  try {
    console.log('[DocumentSummary] Request User:', req.user);

    if (!req.user || !req.user._id || !req.user.role) {
      return res.status(401).json({
        error: 'Unauthorized - Invalid user information',
        details: 'User ID or role missing in authentication token'
      });
    }

    const userIdToQuery = resolveUserId(req);

    if (!userIdToQuery) {
      return res.status(400).json({
        error: 'Bad Request',
        details: 'Invalid user ID format'
      });
    }

    const [ntn, business, gst] = await Promise.all([
      NTNModel.findOne({ userId: userIdToQuery }).lean(),
      BusinessModel.findOne({ userId: userIdToQuery }).lean(),
      GSTModel.findOne({ userId: userIdToQuery }).lean()
    ]);

    const ntnDocs = ntn?.cnicDocumentName ? 1 : 0;

    const businessDocs = business?.documents
      ? Object.values(business.documents).filter(doc => doc && typeof doc === 'string' && doc.trim() !== '').length
      : 0;

    const gstDocs = Array.isArray(gst?.documents)
      ? gst.documents.reduce((acc, doc) => acc + (Array.isArray(doc?.filePaths) ? doc.filePaths.length : 0), 0)
      : 0;

    const totalDocuments = ntnDocs + businessDocs + gstDocs;

    return res.status(200).json({
      success: true,
      userId: userIdToQuery,
      userRole: req.user.role,
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
    console.error('Error in getDocumentSummary:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getAllDocuments = async (req, res) => {
  try {
    console.log('[GetAllDocuments] Request User:', req.user);

    if (!req.user || !req.user._id || !req.user.role) {
      return res.status(401).json({
        error: 'Unauthorized - Invalid user information',
        details: 'User ID or role missing in authentication token'
      });
    }

    const userIdToQuery = resolveUserId(req);

    if (!userIdToQuery) {
      return res.status(400).json({
        error: 'Bad Request',
        details: 'Invalid user ID format'
      });
    }

    const [ntn, business, gst] = await Promise.all([
      NTNModel.findOne({ userId: userIdToQuery }).lean(),
      BusinessModel.findOne({ userId: userIdToQuery }).lean(),
      GSTModel.findOne({ userId: userIdToQuery }).lean()
    ]);

    const documents = [];

    // 🔹 NTN Documents
    if (ntn?.cnicDocumentName && ntn?.cnicFile) {
      documents.push({
        module: 'NTNRegistration',
        docType: 'cnic',
        fileName: ntn.cnicDocumentName,
        fileUrl: ntn.cnicFile,
        uploadedAt: ntn.createdAt || new Date()
      });
    }

    // 🔹 Business Documents
    if (business?.documents) {
      const docFields = [
        { key: 'partnershipDeed', name: 'Partnership Deed' },
        { key: 'partnershipCertificate', name: 'Partnership Certificate' },
        { key: 'authorityLetter', name: 'Authority Letter' },
        { key: 'cnicCopies', name: 'CNIC Copies' },
        { key: 'rentAgreement', name: 'Rent Agreement' },
        { key: 'letterhead', name: 'Letterhead' },
        { key: 'electricityBill', name: 'Electricity Bill' }
      ];

      docFields.forEach(({ key, name }) => {
        if (business.documents[key]?.trim()) {
          documents.push({
            module: 'BusinessIncorporation',
            docType: name,
            fileName: name,
            fileUrl: business.documents[key],
            uploadedAt: business.createdAt || new Date()
          });
        }
      });
    }

    // 🔹 GST Documents
    if (Array.isArray(gst?.documents)) {
      gst.documents.forEach(doc => {
        if (Array.isArray(doc.filePaths)) {
          doc.filePaths.forEach(filePath => {
            if (filePath?.trim()) {
              documents.push({
                module: 'GSTRegistration',
                docType: doc.docType,
                fileName: doc.docType,
                fileUrl: filePath,
                uploadedAt: gst.createdAt || new Date()
              });
            }
          });
        }
      });
    }

    return res.status(200).json({
      success: true,
      userId: userIdToQuery,
      userRole: req.user.role,
      totalDocuments: documents.length,
      documents,
      timestamps: {
        requestedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in getAllDocuments:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Placeholder endpoints
export const getSingleDocument = async (req, res) => {
  const { id } = req.params;
  return res.status(200).json({ message: `getSingleDocument for ID ${id} not yet implemented` });
};

export const updateDocumentStatus = async (req, res) => {
  const { id } = req.params;
  return res.status(200).json({ message: `updateDocumentStatus for ID ${id} not yet implemented` });
};
