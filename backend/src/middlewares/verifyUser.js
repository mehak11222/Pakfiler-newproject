import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(403).json({ 
      message: "Authorization token missing",
      solution: "Include 'Bearer [token]' in Authorization header"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle both 'id' and '_id' in token payload
    const userId = decoded._id || decoded.id;
    
    if (!userId || !decoded.role) {
      return res.status(401).json({
        message: "Invalid token payload",
        required: "Must contain either 'id' or '_id', and 'role'",
        received: Object.keys(decoded)
      });
    }

    // Standardize to '_id' in req.user
    req.user = {
      _id: Types.ObjectId.isValid(userId) ? userId : null,
      role: decoded.role
    };

    if (!req.user._id) {
      return res.status(401).json({
        message: "Invalid user ID format",
        receivedId: userId
      });
    }

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    
    const response = {
      message: "Authentication failed",
      error: error.name === "TokenExpiredError" 
        ? "Token expired" 
        : "Invalid token"
    };
    
    if (error.name === "TokenExpiredError") {
      response.solution = "Please login again";
    }
    
    res.status(401).json(response);
  }
};