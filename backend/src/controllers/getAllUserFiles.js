import NTNModel from '../models/ntnRegistration/ntnRegistration.model.js';
import BusinessModel from '../models/businessIncorporation/businessIncorporation.model.js';
import GSTModel from '../models/gst/gstRegistration.model.js';
import { Types } from 'mongoose';

export const getAllUserFiles = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        error: 'Unauthorized',
        details: 'Invalid or missing user ID in token',
      });
    }

    const [ntn, business, gst] = await Promise.all([
      NTNModel.findOne({ userId }),
      BusinessModel.findOne({ userId }),
      GSTModel.findOne({ userId }),
    ]);

    // Extract file paths from each module
    const ntnFiles = ntn?.cnicFile ? [ntn.cnicFile] : [];

    const businessFiles = business?.documents
      ? Object.values(business.documents).filter(file => typeof file === 'string' && file.trim() !== '')
      : [];

    const gstFiles = Array.isArray(gst?.documents)
      ? gst.documents.flatMap(doc => doc.filePaths || [])
      : [];

    return res.status(200).json({
      success: true,
      userId,
      files: {
        ntn: ntnFiles,
        businessIncorporation: businessFiles,
        gst: gstFiles
      },
      totalCount: ntnFiles.length + businessFiles.length + gstFiles.length
    });
  } catch (error) {
    console.error('Error in getAllUserFiles:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
};
