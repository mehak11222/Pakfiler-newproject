import NTNModel from "../../models/ntnRegistration/ntnRegistration.model.js";
import BusinessModel from "../../models/businessIncorporation/businessIncorporation.model.js";
import GSTModel from "../../models/gst/gstRegistration.model.js";
import TaxFiling from '../../models/tax.model.js';
import User from "../../models/User.js";
import { Types } from "mongoose";
import PDFDocument from "pdfkit";

// Get all documents from all users with enhanced status tracking (Admin only)
export const getAllUserDocuments = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", module = "all", status = "all", dateFrom, dateTo } = req.query;

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

    // Build user search query
    let userQuery = {};
    if (search) {
      userQuery = {
        $or: [
          { fullName: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
          { cnic: new RegExp(search, "i") },
        ],
      };
    }

    // Date filter
    const dateFilter = {};
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {};
      if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo);
    }

    // Get users matching search criteria
    const users = await User.find(userQuery).select("_id fullName email cnic");
    const userIds = users.map((user) => user._id);

    const allDocuments = [];

    // Fetch documents based on module filter
    if (module === "all" || module === "ntn") {
      const ntnRecords = await NTNModel.find({
        ...(userIds.length > 0 ? { userId: { $in: userIds } } : {}),
        ...dateFilter,
      }).populate("userId", "fullName email cnic");

      ntnRecords.forEach((record) => {
        if (record.cnicFile && record.cnicDocumentName) {
          allDocuments.push({
            _id: record._id,
            module: "NTN Registration",
            docType: "CNIC Document",
            fileName: record.cnicDocumentName,
            filePath: record.cnicFile,
            uploadedAt: record.createdAt,
            user: {
              _id: record.userId._id,
              fullName: record.userId.fullName,
              email: record.userId.email,
              cnic: record.userId.cnic,
            },
            status: record.documentStatus || "pending",
            approvedBy: record.approvedBy,
            approvedAt: record.approvedAt,
            rejectionReason: record.rejectionReason,
            reviewNotes: record.reviewNotes,
          });
        }
      });
    }

    if (module === "all" || module === "business") {
      const businessRecords = await BusinessModel.find({
        ...(userIds.length > 0 ? { userId: { $in: userIds } } : {}),
        ...dateFilter,
      }).populate("userId", "fullName email cnic");

      businessRecords.forEach((record) => {
        if (record.documents) {
          const docFields = [
            { key: "partnershipDeed", name: "Partnership Deed" },
            { key: "partnershipCertificate", name: "Partnership Certificate" },
            { key: "authorityLetter", name: "Authority Letter" },
            { key: "cnicCopies", name: "CNIC Copies" },
            { key: "rentAgreement", name: "Rent Agreement" },
            { key: "letterhead", name: "Letterhead" },
            { key: "electricityBill", name: "Electricity Bill" },
          ];

          docFields.forEach(({ key, name }) => {
            if (record.documents[key]?.trim()) {
              allDocuments.push({
                _id: `${record._id}_${key}`,
                module: "Business Incorporation",
                docType: name,
                fileName: name,
                filePath: record.documents[key],
                uploadedAt: record.createdAt,
                user: {
                  _id: record.userId._id,
                  fullName: record.userId.fullName,
                  email: record.userId.email,
                  cnic: record.userId.cnic,
                },
                businessName: record.businessName,
                purpose: record.purpose,
                status: record.documentStatus?.[key] || "pending",
                approvedBy: record.approvedBy?.[key],
                approvedAt: record.approvedAt?.[key],
                rejectionReason: record.rejectionReason?.[key],
                reviewNotes: record.reviewNotes?.[key],
              });
            }
          });
        }
      });
    }

    if (module === "all" || module === "gst") {
      const gstRecords = await GSTModel.find({
        ...(userIds.length > 0 ? { userId: { $in: userIds } } : {}),
        ...dateFilter,
      }).populate("userId", "fullName email cnic");

      gstRecords.forEach((record) => {
        if (Array.isArray(record.documents)) {
          record.documents.forEach((doc, docIndex) => {
            if (Array.isArray(doc.filePaths)) {
              doc.filePaths.forEach((filePath, fileIndex) => {
                if (filePath?.trim()) {
                  allDocuments.push({
                    _id: `${record._id}_${docIndex}_${fileIndex}`,
                    module: "GST Registration",
                    docType: doc.docType,
                    fileName: `${doc.docType}_${fileIndex + 1}`,
                    filePath: filePath,
                    uploadedAt: record.createdAt,
                    user: {
                      _id: record.userId._id,
                      fullName: record.userId.fullName,
                      email: record.userId.email,
                      cnic: record.userId.cnic,
                    },
                    businessName: record.businessName,
                    businessType: record.businessType,
                    gstStatus: record.status,
                    status: doc.documentStatus || "pending",
                    approvedBy: doc.approvedBy,
                    approvedAt: doc.approvedAt,
                    rejectionReason: doc.rejectionReason,
                    reviewNotes: doc.reviewNotes,
                  });
                }
              });
            }
          });
        }
      });
    }

    // Filter by status
    let filteredDocuments = allDocuments;
    if (status !== "all") {
      filteredDocuments = allDocuments.filter((doc) => doc.status === status);
    }

    // Sort by upload date (newest first)
    filteredDocuments.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    // Apply pagination
    const totalDocuments = filteredDocuments.length;
    const paginatedDocuments = filteredDocuments.slice(skip, skip + Number.parseInt(limit));

    // Calculate statistics
    const stats = {
      total: allDocuments.length,
      approved: allDocuments.filter((doc) => doc.status === "approved").length,
      pending: allDocuments.filter((doc) => doc.status === "pending").length,
      rejected: allDocuments.filter((doc) => doc.status === "rejected").length,
      underReview: allDocuments.filter((doc) => doc.status === "under_review").length,
      moduleBreakdown: {
        ntn: allDocuments.filter((doc) => doc.module === "NTN Registration").length,
        business: allDocuments.filter((doc) => doc.module === "Business Incorporation").length,
        gst: allDocuments.filter((doc) => doc.module === "GST Registration").length,
      },
      totalUsers: [...new Set(allDocuments.map((doc) => doc.user._id.toString()))].length,
    };

    return res.status(200).json({
      success: true,
      message: "All user documents fetched successfully",
      data: {
        documents: paginatedDocuments,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(totalDocuments / Number.parseInt(limit)),
          totalDocuments,
          documentsPerPage: Number.parseInt(limit),
          hasNextPage: skip + Number.parseInt(limit) < totalDocuments,
          hasPrevPage: Number.parseInt(page) > 1,
        },
        statistics: stats,
        filters: {
          search,
          module,
          status,
          dateFrom,
          dateTo,
          appliedFilters: {
            searchApplied: !!search,
            moduleFilter: module,
            statusFilter: status,
            dateFilter: !!(dateFrom || dateTo),
          },
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in getAllUserDocuments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user documents",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Update document status (approve/reject/under review)
export const updateDocumentStatus = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { status, rejectionReason, reviewNotes } = req.body;
    const adminId = req.user._id;

    if (!["approved", "rejected", "under_review", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: approved, rejected, under_review, or pending",
      });
    }

    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required when rejecting a document",
      });
    }

    // Determine document type and update accordingly
    let updateResult = null;

    // Try NTN first
    if (Types.ObjectId.isValid(documentId)) {
      updateResult = await NTNModel.findByIdAndUpdate(
        documentId,
        {
          documentStatus: status,
          approvedBy: status === "approved" ? adminId : undefined,
          approvedAt: status === "approved" ? new Date() : undefined,
          rejectionReason: status === "rejected" ? rejectionReason : undefined,
          reviewNotes,
          updatedAt: new Date(),
        },
        { new: true },
      );
    }

    // If not found in NTN, try Business (composite ID format)
    if (!updateResult && documentId.includes("_")) {
      const [businessId, docField] = documentId.split("_");
      if (Types.ObjectId.isValid(businessId)) {
        updateResult = await BusinessModel.findByIdAndUpdate(
          businessId,
          {
            [`documentStatus.${docField}`]: status,
            [`approvedBy.${docField}`]: status === "approved" ? adminId : undefined,
            [`approvedAt.${docField}`]: status === "approved" ? new Date() : undefined,
            [`rejectionReason.${docField}`]: status === "rejected" ? rejectionReason : undefined,
            [`reviewNotes.${docField}`]: reviewNotes,
            updatedAt: new Date(),
          },
          { new: true },
        );
      }
    }

    // If still not found, try GST (composite ID format)
    if (!updateResult && documentId.includes("_")) {
      const parts = documentId.split("_");
      if (parts.length >= 3) {
        const [gstId, docIndex] = parts;
        if (Types.ObjectId.isValid(gstId)) {
          updateResult = await GSTModel.findOneAndUpdate(
            { _id: gstId },
            {
              $set: {
                [`documents.${docIndex}.documentStatus`]: status,
                [`documents.${docIndex}.approvedBy`]: status === "approved" ? adminId : undefined,
                [`documents.${docIndex}.approvedAt`]: status === "approved" ? new Date() : undefined,
                [`documents.${docIndex}.rejectionReason`]: status === "rejected" ? rejectionReason : undefined,
                [`documents.${docIndex}.reviewNotes`]: reviewNotes,
                updatedAt: new Date(),
              },
            },
            { new: true },
          );
        }
      }
    }

    if (!updateResult) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Document ${status} successfully`,
      data: {
        documentId,
        status,
        approvedBy: status === "approved" ? adminId : undefined,
        approvedAt: status === "approved" ? new Date() : undefined,
        rejectionReason: status === "rejected" ? rejectionReason : undefined,
        reviewNotes,
      },
    });
  } catch (error) {
    console.error("Error updating document status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update document status",
      error: error.message,
    });
  }
};

// Get comprehensive admin dashboard statistics
export const getAdminDashboardStats = async (req, res) => {
  try {
    // Document statistics
    const [ntnDocs, businessDocs, gstDocs] = await Promise.all([
      NTNModel.find({ cnicFile: { $exists: true, $ne: "" } }),
      BusinessModel.find({
        $or: [
          { "documents.partnershipDeed": { $exists: true, $ne: "" } },
          { "documents.partnershipCertificate": { $exists: true, $ne: "" } },
          { "documents.authorityLetter": { $exists: true, $ne: "" } },
          { "documents.cnicCopies": { $exists: true, $ne: "" } },
          { "documents.rentAgreement": { $exists: true, $ne: "" } },
          { "documents.letterhead": { $exists: true, $ne: "" } },
          { "documents.electricityBill": { $exists: true, $ne: "" } },
        ],
      }),
      GSTModel.find({ "documents.0": { $exists: true } }),
    ]);

    // Tax filing statistics
    const taxFilingStats = await TaxFiling.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taxFilingStatusCounts = {
      pending: 0,
      under_review: 0,
      completed: 0,
      rejected: 0,
    };

    taxFilingStats.forEach((stat) => {
      taxFilingStatusCounts[stat._id] = stat.count;
    });

    // Document status counts
    const documentStatusCounts = {
      approved: 0,
      pending: 0,
      rejected: 0,
      under_review: 0,
    };

    // Count NTN document statuses
    ntnDocs.forEach((doc) => {
      const status = doc.documentStatus || "pending";
      documentStatusCounts[status] = (documentStatusCounts[status] || 0) + 1;
    });

    // Count Business document statuses
    businessDocs.forEach((record) => {
      if (record.documentStatus) {
        Object.values(record.documentStatus).forEach((status) => {
          documentStatusCounts[status] = (documentStatusCounts[status] || 0) + 1;
        });
      } else {
        // Count documents without status as pending
        const docFields = [
          "partnershipDeed",
          "partnershipCertificate",
          "authorityLetter",
          "cnicCopies",
          "rentAgreement",
          "letterhead",
          "electricityBill",
        ];
        docFields.forEach((field) => {
          if (record.documents?.[field]?.trim()) {
            documentStatusCounts.pending += 1;
          }
        });
      }
    });

    // Count GST document statuses
    gstDocs.forEach((record) => {
      if (Array.isArray(record.documents)) {
        record.documents.forEach((doc) => {
          const status = doc.documentStatus || "pending";
          documentStatusCounts[status] = (documentStatusCounts[status] || 0) + 1;
        });
      }
    });

    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = {
      newUsers: await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      newDocuments:
        (await NTNModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } })) +
        (await BusinessModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } })) +
        (await GSTModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } })),
      newTaxFilings: await TaxFiling.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    };

    return res.status(200).json({
      success: true,
      message: "Admin dashboard statistics fetched successfully",
      data: {
        documents: {
          total:
            documentStatusCounts.approved +
            documentStatusCounts.pending +
            documentStatusCounts.rejected +
            documentStatusCounts.under_review,
          approved: documentStatusCounts.approved,
          pending: documentStatusCounts.pending,
          rejected: documentStatusCounts.rejected,
          underReview: documentStatusCounts.under_review,
          moduleBreakdown: {
            ntn: ntnDocs.length,
            business: businessDocs.length,
            gst: gstDocs.length,
          },
        },
        taxFilings: {
          total: Object.values(taxFilingStatusCounts).reduce((a, b) => a + b, 0),
          pending: taxFilingStatusCounts.pending,
          underReview: taxFilingStatusCounts.under_review,
          completed: taxFilingStatusCounts.completed,
          rejected: taxFilingStatusCounts.rejected,
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
        },
        recentActivity,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in getAdminDashboardStats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard statistics",
      error: error.message,
    });
  }
};

// Get tax filing details with document integration
export const getTaxFilingDetails = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = "all", search = "" } = req.query;
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

    // Build query
    const query = {};
    if (status !== "all") {
      query.status = status;
    }

    // Get tax filings with user details
    const taxFilings = await TaxFiling.find(query)
      .populate("userId", "fullName email cnic phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit));

    // Filter by search if provided
    let filteredFilings = taxFilings;
    if (search) {
      filteredFilings = taxFilings.filter(
        (filing) =>
          filing.userId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          filing.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
          filing.userId?.cnic?.includes(search) ||
          filing.taxYear?.includes(search),
      );
    }

    // Get document counts for each user
    const filingsWithDocuments = await Promise.all(
      filteredFilings.map(async (filing) => {
        const userId = filing.userId._id;

        const [ntn, business, gst] = await Promise.all([
          NTNModel.findOne({ userId }),
          BusinessModel.findOne({ userId }),
          GSTModel.findOne({ userId }),
        ]);

        let documentCount = 0;
        let approvedDocuments = 0;
        let pendingDocuments = 0;
        let rejectedDocuments = 0;

        // Count NTN documents
        if (ntn?.cnicFile) {
          documentCount += 1;
          const status = ntn.documentStatus || "pending";
          if (status === "approved") approvedDocuments += 1;
          else if (status === "rejected") rejectedDocuments += 1;
          else pendingDocuments += 1;
        }

        // Count Business documents
        if (business?.documents) {
          const docFields = [
            "partnershipDeed",
            "partnershipCertificate",
            "authorityLetter",
            "cnicCopies",
            "rentAgreement",
            "letterhead",
            "electricityBill",
          ];
          docFields.forEach((field) => {
            if (business.documents[field]?.trim()) {
              documentCount += 1;
              const status = business.documentStatus?.[field] || "pending";
              if (status === "approved") approvedDocuments += 1;
              else if (status === "rejected") rejectedDocuments += 1;
              else pendingDocuments += 1;
            }
          });
        }

        // Count GST documents
        if (Array.isArray(gst?.documents)) {
          gst.documents.forEach((doc) => {
            if (Array.isArray(doc.filePaths)) {
              documentCount += doc.filePaths.length;
              doc.filePaths.forEach(() => {
                const status = doc.documentStatus || "pending";
                if (status === "approved") approvedDocuments += 1;
                else if (status === "rejected") rejectedDocuments += 1;
                else pendingDocuments += 1;
              });
            }
          });
        }

        return {
          ...filing.toObject(),
          documentSummary: {
            total: documentCount,
            approved: approvedDocuments,
            pending: pendingDocuments,
            rejected: rejectedDocuments,
          },
        };
      }),
    );

    const totalCount = await TaxFiling.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Tax filing details fetched successfully",
      data: {
        taxFilings: filingsWithDocuments,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(totalCount / Number.parseInt(limit)),
          totalFilings: totalCount,
          filingsPerPage: Number.parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error in getTaxFilingDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tax filing details",
      error: error.message,
    });
  }
};

// Generate PDF report
export const generateDocumentReport = async (req, res) => {
  try {
    const { reportType = "summary", dateFrom, dateTo, module = "all" } = req.query;

    // Get data based on report type
    let reportData = {};

    if (reportType === "summary") {
      reportData = await getDocumentStatisticsData();
    } else if (reportType === "detailed") {
      reportData = await getAllDocumentsData({ module, dateFrom, dateTo });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid report type. Must be 'summary' or 'detailed'",
      });
    }

    // Validate reportData
    if (!reportData) {
      throw new Error("Failed to fetch report data");
    }

    // Create PDF
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="document-report-${Date.now()}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text("Document Report", 50, 50);
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 80);
    doc.text(`Report Type: ${reportType}`, 50, 100);

    if (reportType === "summary") {
      // Ensure reportData has required properties
      if (!reportData.total && reportData.total !== 0) {
        throw new Error("Invalid summary report data");
      }
      doc.text(`Total Documents: ${reportData.total}`, 50, 130);
      doc.text(`Approved: ${reportData.approved || 0}`, 50, 150);
      doc.text(`Pending: ${reportData.pending || 0}`, 50, 170);
      doc.text(`Rejected: ${reportData.rejected || 0}`, 50, 190);
      doc.text(`Under Review: ${reportData.underReview || 0}`, 50, 210);
    } else if (reportType === "detailed") {
      // Ensure reportData.documents exists
      if (!Array.isArray(reportData.documents)) {
        throw new Error("Invalid detailed report data");
      }
      let yPosition = 130;
      reportData.documents.forEach((document, index) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }
        doc.text(`${index + 1}. ${document.fileName} - ${document.status}`, 50, yPosition);
        doc.text(`   User: ${document.user.fullName} (${document.user.email})`, 50, yPosition + 15);
        doc.text(`   Module: ${document.module}`, 50, yPosition + 30);
        yPosition += 60;
      });
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Error generating PDF report:", error);
    // Only send error response if headers haven't been sent
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate PDF report",
        error: error.message,
      });
    }
  }
};

// Get upload timeline
export const getUploadTimeline = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number.parseInt(days));

    // Get daily upload counts
    const timeline = [];
    for (let i = Number.parseInt(days) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const [ntnCount, businessCount, gstCount] = await Promise.all([
        NTNModel.countDocuments({
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          cnicFile: { $exists: true, $ne: "" },
        }),
        BusinessModel.countDocuments({
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          $or: [
            { "documents.partnershipDeed": { $exists: true, $ne: "" } },
            { "documents.partnershipCertificate": { $exists: true, $ne: "" } },
            { "documents.authorityLetter": { $exists: true, $ne: "" } },
            { "documents.cnicCopies": { $exists: true, $ne: "" } },
            { "documents.rentAgreement": { $exists: true, $ne: "" } },
            { "documents.letterhead": { $exists: true, $ne: "" } },
            { "documents.electricityBill": { $exists: true, $ne: "" } },
          ],
        }),
        GSTModel.countDocuments({
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          "documents.0": { $exists: true },
        }),
      ]);

      timeline.push({
        date: startOfDay.toISOString().split("T")[0],
        ntn: ntnCount,
        business: businessCount,
        gst: gstCount,
        total: ntnCount + businessCount + gstCount,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Upload timeline fetched successfully",
      data: {
        timeline,
        summary: {
          totalDays: Number.parseInt(days),
          totalUploads: timeline.reduce((sum, day) => sum + day.total, 0),
          averagePerDay: (timeline.reduce((sum, day) => sum + day.total, 0) / Number.parseInt(days)).toFixed(2),
        },
      },
    });
  } catch (error) {
    console.error("Error in getUploadTimeline:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch upload timeline",
      error: error.message,
    });
  }
};

// Get documents by status
export const getDocumentsByStatus = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    if (!["approved", "pending", "rejected", "under_review"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status parameter",
      });
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);
    const allDocuments = [];

    // Get all documents and filter by status
    const [ntnRecords, businessRecords, gstRecords] = await Promise.all([
      NTNModel.find({ cnicFile: { $exists: true, $ne: "" } }).populate("userId", "fullName email cnic"),
      BusinessModel.find({
        $or: [
          { "documents.partnershipDeed": { $exists: true, $ne: "" } },
          { "documents.partnershipCertificate": { $exists: true, $ne: "" } },
          { "documents.authorityLetter": { $exists: true, $ne: "" } },
          { "documents.cnicCopies": { $exists: true, $ne: "" } },
          { "documents.rentAgreement": { $exists: true, $ne: "" } },
          { "documents.letterhead": { $exists: true, $ne: "" } },
          { "documents.electricityBill": { $exists: true, $ne: "" } },
        ],
      }).populate("userId", "fullName email cnic"),
      GSTModel.find({ "documents.0": { $exists: true } }).populate("userId", "fullName email cnic"),
    ]);

    // Process NTN documents
    ntnRecords.forEach((record) => {
      if (record.cnicFile && record.cnicDocumentName) {
        allDocuments.push({
          _id: record._id,
          module: "NTN Registration",
          docType: "CNIC Document",
          fileName: record.cnicDocumentName,
          filePath: record.cnicFile,
          uploadedAt: record.createdAt,
          user: {
            _id: record.userId._id,
            fullName: record.userId.fullName,
            email: record.userId.email,
            cnic: record.userId.cnic,
          },
          status: record.documentStatus || "pending",
          approvedBy: record.approvedBy,
          approvedAt: record.approvedAt,
          rejectionReason: record.rejectionReason,
          reviewNotes: record.reviewNotes,
        });
      }
    });

    // Process Business documents
    businessRecords.forEach((record) => {
      if (record.documents) {
        const docFields = [
          { key: "partnershipDeed", name: "Partnership Deed" },
          { key: "partnershipCertificate", name: "Partnership Certificate" },
          { key: "authorityLetter", name: "Authority Letter" },
          { key: "cnicCopies", name: "CNIC Copies" },
          { key: "rentAgreement", name: "Rent Agreement" },
          { key: "letterhead", name: "Letterhead" },
          { key: "electricityBill", name: "Electricity Bill" },
        ];
        docFields.forEach(({ key, name }) => {
          if (record.documents[key]?.trim()) {
            allDocuments.push({
              _id: `${record._id}_${key}`,
              module: "Business Incorporation",
              docType: name,
              fileName: name,
              filePath: record.documents[key],
              uploadedAt: record.createdAt,
              user: {
                _id: record.userId._id,
                fullName: record.userId.fullName,
                email: record.userId.email,
                cnic: record.userId.cnic,
              },
              businessName: record.businessName,
              purpose: record.purpose,
              status: record.documentStatus?.[key] || "pending",
              approvedBy: record.approvedBy?.[key],
              approvedAt: record.approvedAt?.[key],
              rejectionReason: record.rejectionReason?.[key],
              reviewNotes: record.reviewNotes?.[key],
            });
          }
        });
      }
    });

    // Process GST documents
    gstRecords.forEach((record) => {
      if (Array.isArray(record.documents)) {
        record.documents.forEach((doc, docIndex) => {
          if (Array.isArray(doc.filePaths)) {
            doc.filePaths.forEach((filePath, fileIndex) => {
              if (filePath?.trim()) {
                allDocuments.push({
                  _id: `${record._id}_${docIndex}_${fileIndex}`,
                  module: "GST Registration",
                  docType: doc.docType,
                  fileName: `${doc.docType}_${fileIndex + 1}`,
                  filePath: filePath,
                  uploadedAt: record.createdAt,
                  user: {
                    _id: record.userId._id,
                    fullName: record.userId.fullName,
                    email: record.userId.email,
                    cnic: record.userId.cnic,
                  },
                  businessName: record.businessName,
                  businessType: record.businessType,
                  gstStatus: record.status,
                  status: doc.documentStatus || "pending",
                  approvedBy: doc.approvedBy,
                  approvedAt: doc.approvedAt,
                  rejectionReason: doc.rejectionReason,
                  reviewNotes: doc.reviewNotes,
                });
              }
            });
          }
        });
      }
    });

    const filteredDocuments = allDocuments.filter((doc) => doc.status === status);
    const paginatedDocuments = filteredDocuments.slice(skip, skip + Number.parseInt(limit));

    return res.status(200).json({
      success: true,
      message: `Documents with status '${status}' fetched successfully`,
      data: {
        documents: paginatedDocuments,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(filteredDocuments.length / Number.parseInt(limit)),
          totalDocuments: filteredDocuments.length,
          documentsPerPage: Number.parseInt(limit),
        },
        status,
      },
    });
  } catch (error) {
    console.error("Error in getDocumentsByStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents by status",
      error: error.message,
    });
  }
};

// Helper functions
async function getDocumentStatisticsData() {
  try {
    // Fetch document statistics
    const [ntnDocs, businessDocs, gstDocs] = await Promise.all([
      NTNModel.find({ cnicFile: { $exists: true, $ne: "" } }),
      BusinessModel.find({
        $or: [
          { "documents.partnershipDeed": { $exists: true, $ne: "" } },
          { "documents.partnershipCertificate": { $exists: true, $ne: "" } },
          { "documents.authorityLetter": { $exists: true, $ne: "" } },
          { "documents.cnicCopies": { $exists: true, $ne: "" } },
          { "documents.rentAgreement": { $exists: true, $ne: "" } },
          { "documents.letterhead": { $exists: true, $ne: "" } },
          { "documents.electricityBill": { $exists: true, $ne: "" } },
        ],
      }),
      GSTModel.find({ "documents.0": { $exists: true } }),
    ]);

    // Document status counts
    const documentStatusCounts = {
      approved: 0,
      pending: 0,
      rejected: 0,
      under_review: 0,
    };

    // Count NTN document statuses
    ntnDocs.forEach((doc) => {
      const status = doc.documentStatus || "pending";
      documentStatusCounts[status] = (documentStatusCounts[status] || 0) + 1;
    });

    // Count Business document statuses
    businessDocs.forEach((record) => {
      if (record.documentStatus) {
        Object.values(record.documentStatus).forEach((status) => {
          documentStatusCounts[status] = (documentStatusCounts[status] || 0) + 1;
        });
      } else {
        const docFields = [
          "partnershipDeed",
          "partnershipCertificate",
          "authorityLetter",
          "cnicCopies",
          "rentAgreement",
          "letterhead",
          "electricityBill",
        ];
        docFields.forEach((field) => {
          if (record.documents?.[field]?.trim()) {
            documentStatusCounts.pending += 1;
          }
        });
      }
    });

    // Count GST document statuses
    gstDocs.forEach((record) => {
      if (Array.isArray(record.documents)) {
        record.documents.forEach((doc) => {
          const status = doc.documentStatus || "pending";
          documentStatusCounts[status] = (documentStatusCounts[status] || 0) + 1;
        });
      }
    });

    return {
      total:
        documentStatusCounts.approved +
        documentStatusCounts.pending +
        documentStatusCounts.rejected +
        documentStatusCounts.under_review,
      approved: documentStatusCounts.approved,
      pending: documentStatusCounts.pending,
      rejected: documentStatusCounts.rejected,
      underReview: documentStatusCounts.under_review,
      moduleBreakdown: {
        ntn: ntnDocs.length,
        business: businessDocs.length,
        gst: gstDocs.length,
      },
    };
  } catch (error) {
    console.error("Error in getDocumentStatisticsData:", error);
    throw error; // Let the caller handle the error
  }
}

async function getAllDocumentsData({ module = "all", dateFrom, dateTo }) {
  try {
    const allDocuments = [];
    const dateFilter = {};
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {};
      if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo);
    }

    // Fetch NTN documents
    if (module === "all" || module === "ntn") {
      const ntnRecords = await NTNModel.find(dateFilter).populate("userId", "fullName email cnic");
      ntnRecords.forEach((record) => {
        if (record.cnicFile && record.cnicDocumentName) {
          allDocuments.push({
            _id: record._id,
            module: "NTN Registration",
            docType: "CNIC Document",
            fileName: record.cnicDocumentName,
            filePath: record.cnicFile,
            uploadedAt: record.createdAt,
            user: {
              _id: record.userId._id,
              fullName: record.userId.fullName,
              email: record.userId.email,
              cnic: record.userId.cnic,
            },
            status: record.documentStatus || "pending",
            approvedBy: record.approvedBy,
            approvedAt: record.approvedAt,
            rejectionReason: record.rejectionReason,
            reviewNotes: record.reviewNotes,
          });
        }
      });
    }

    // Fetch Business documents
    if (module === "all" || module === "business") {
      const businessRecords = await BusinessModel.find(dateFilter).populate("userId", "fullName email cnic");
      businessRecords.forEach((record) => {
        if (record.documents) {
          const docFields = [
            { key: "partnershipDeed", name: "Partnership Deed" },
            { key: "partnershipCertificate", name: "Partnership Certificate" },
            { key: "authorityLetter", name: "Authority Letter" },
            { key: "cnicCopies", name: "CNIC Copies" },
            { key: "rentAgreement", name: "Rent Agreement" },
            { key: "letterhead", name: "Letterhead" },
            { key: "electricityBill", name: "Electricity Bill" },
          ];
          docFields.forEach(({ key, name }) => {
            if (record.documents[key]?.trim()) {
              allDocuments.push({
                _id: `${record._id}_${key}`,
                module: "Business Incorporation",
                docType: name,
                fileName: name,
                filePath: record.documents[key],
                uploadedAt: record.createdAt,
                user: {
                  _id: record.userId._id,
                  fullName: record.userId.fullName,
                  email: record.userId.email,
                  cnic: record.userId.cnic,
                },
                businessName: record.businessName,
                purpose: record.purpose,
                status: record.documentStatus?.[key] || "pending",
                approvedBy: record.approvedBy?.[key],
                approvedAt: record.approvedAt?.[key],
                rejectionReason: record.rejectionReason?.[key],
                reviewNotes: record.reviewNotes?.[key],
              });
            }
          });
        }
      });
    }

    // Fetch GST documents
    if (module === "all" || module === "gst") {
      const gstRecords = await GSTModel.find(dateFilter).populate("userId", "fullName email cnic");
      gstRecords.forEach((record) => {
        if (Array.isArray(record.documents)) {
          record.documents.forEach((doc, docIndex) => {
            if (Array.isArray(doc.filePaths)) {
              doc.filePaths.forEach((filePath, fileIndex) => {
                if (filePath?.trim()) {
                  allDocuments.push({
                    _id: `${record._id}_${docIndex}_${fileIndex}`,
                    module: "GST Registration",
                    docType: doc.docType,
                    fileName: `${doc.docType}_${fileIndex + 1}`,
                    filePath: filePath,
                    uploadedAt: record.createdAt,
                    user: {
                      _id: record.userId._id,
                      fullName: record.userId.fullName,
                      email: record.userId.email,
                      cnic: record.userId.cnic,
                    },
                    businessName: record.businessName,
                    businessType: record.businessType,
                    gstStatus: record.status,
                    status: doc.documentStatus || "pending",
                    approvedBy: doc.approvedBy,
                    approvedAt: doc.approvedAt,
                    rejectionReason: doc.rejectionReason,
                    reviewNotes: doc.reviewNotes,
                  });
                }
              });
            }
          });
        }
      });
    }

    return { documents: allDocuments };
  } catch (error) {
    console.error("Error in getAllDocumentsData:", error);
    throw error; // Let the caller handle the error
  }
}