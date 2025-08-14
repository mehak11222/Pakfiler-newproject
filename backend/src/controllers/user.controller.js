import User from "../models/User.js";
import Document from "../models/Document.js";
import ServiceCharge from "../models/ServiceCharge.js";

// 1. Upload Document
export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;

    const doc = await Document.create({
      userId: req.user.id,
      fileType: req.body.fileType,
      fileUrl: file.path,
    });

    res.status(201).json({ message: "Document uploaded", data: doc });
  } catch (error) {
    res.status(500).json({ message: "Error uploading document", error });
  }
};

// 2. Get Service Charges
export const getCharges = async (req, res) => {
  try {
    const charges = await ServiceCharge.find();
    res.status(200).json({ message: "Service charges fetched", data: charges });
  } catch (error) {
    res.status(500).json({ message: "Error fetching charges", error });
  }
};

// 3. Get All Users with Pagination & Search
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { fullName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { role: new RegExp(search, "i") }
      ]
    };

    const users = await User.find(query)
      .select("-password")
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();

    const count = await User.countDocuments(query);

    res.status(200).json({
      message: "Users fetched successfully",
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalUsers: count,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// 4. Toggle User Status
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();

    res.status(200).json({
      message: `User status updated to ${user.status}`,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user status", error });
  }
};

// 5. Get User By ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User fetched", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};
