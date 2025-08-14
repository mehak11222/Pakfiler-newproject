import multer from "multer"
import path from "path"
import fs from "fs"

// Setup upload path for payment proofs
const uploadPath = path.join(process.cwd(), "src", "uploads", "payment-proofs")
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true })
}

// File filter for payment proofs (images and PDFs only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|gif/
  const ext = path.extname(file.originalname).toLowerCase()
  const mimeType = allowedTypes.test(file.mimetype)
  const extName = allowedTypes.test(ext)

  if (mimeType && extName) {
    cb(null, true)
  } else {
    cb(new Error("Only image files (JPEG, JPG, PNG, GIF) and PDF files are allowed"), false)
  }
}

// Multer storage config for payment proofs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // Create unique filename: userId_timestamp_originalname
    const userId = req.user?._id || "unknown"
    const timestamp = Date.now()
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")
    const uniqueFilename = `${userId}_${timestamp}_${sanitizedOriginalName}`
    cb(null, uniqueFilename)
  },
})

export const paymentUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5, // Maximum 5 files
  },
})

// Error handling middleware for multer
export const handlePaymentUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 10MB per file.",
      })
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum 5 files allowed.",
      })
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Unexpected field name for file upload.",
      })
    }
  }

  if (error.message.includes("Only image files")) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }

  next(error)
}
