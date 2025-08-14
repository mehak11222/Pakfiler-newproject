import FamilyAccount from '../../models/FamilyTaxFilling/familyAccount.model.js';
import User from '../../models/User.js';

// ✅ Create New Family/Business Account
export const createFamilyAccount = async (req, res) => {
  try {
    const {
      accountName,
      cnic,
      email,
      mobile,
      relation,
      accountEmail,
      userType
    } = req.body;

    const exists = await FamilyAccount.findOne({
      mainUserId: req.user.id,
      accountEmail
    });

    if (exists) {
      return res.status(400).json({ error: 'Account with this email already linked' });
    }

    const newAccount = new FamilyAccount({
      mainUserId: req.user.id,
      accountName,
      cnic,
      email,
      mobile,
      relation,
      accountEmail,
      userType
    });

    await newAccount.save();
    res.status(201).json({ message: 'Family/Business account created', data: newAccount });
  } catch (error) {
    console.error("Error in createFamilyAccount:", error);
    res.status(500).json({ error: 'Server error while creating account' });
  }
};

// ✅ Tag Existing Account by Email
export const tagExistingAccount = async (req, res) => {
  try {
    const { accountEmail, userType, relation } = req.body;
    const normalizedEmail = accountEmail.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: {
        $regex: new RegExp(`^${normalizedEmail}$`, 'i')
      }
    });

    if (!existingUser) {
      const allUsers = await User.find({}, 'email');
      return res.status(404).json({
        error: 'User not found with this email',
        searchedEmail: normalizedEmail,
        availableEmails: allUsers.map(u => u.email)
      });
    }

    const alreadyTagged = await FamilyAccount.findOne({
      mainUserId: req.user.id,
      linkedUserId: existingUser._id
    });

    if (alreadyTagged) {
      return res.status(400).json({ error: 'This account is already tagged' });
    }

    const newTag = new FamilyAccount({
      mainUserId: req.user.id,
      accountName: existingUser.fullName || 'N/A',
      cnic: existingUser.cnic || 'N/A',
      email: existingUser.email,
      mobile: existingUser.phone || '',
      accountEmail: existingUser.email,
      userType,
      relation,
      linkedUserId: existingUser._id
    });

    await newTag.save();
    res.status(201).json({ message: 'Account tagged successfully', data: newTag });

  } catch (error) {
    console.error("Unexpected error in tagExistingAccount:", error);
    res.status(500).json({
      error: 'Error while tagging account',
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ✅ Get All Family Accounts for Logged-in User
export const getAllFamilyAccounts = async (req, res) => {
  try {
    const accounts = await FamilyAccount.find({ mainUserId: req.user.id });
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching family accounts:", error);
    res.status(500).json({ error: 'Error fetching accounts' });
  }
};

// ✅ Get Family Account by ID
export const getFamilyAccountById = async (req, res) => {
  try {
    const account = await FamilyAccount.findOne({
      _id: req.params.id,
      mainUserId: req.user.id
    });

    if (!account) {
      return res.status(404).json({ error: 'Family account not found' });
    }

    res.status(200).json(account);
  } catch (error) {
    console.error("Error fetching account by ID:", error);
    res.status(500).json({ error: 'Error fetching family account' });
  }
};
