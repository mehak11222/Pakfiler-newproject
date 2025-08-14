import IRISProfile from '../../models/irisProfile/irisProfile.model.js';

// Step 1: Create / Update Personal Info
export const submitPersonalInfo = async (req, res) => {
  try {
    const { email, mobile, presentAddress, pin, password, sourceOfIncome, bankAccounts } = req.body;
    const userId = req.user.id;

    const profile = await IRISProfile.findOneAndUpdate(
      { userId },
      { email, mobile, presentAddress, pin, password, sourceOfIncome, bankAccounts },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Personal info saved', data: profile });
  } catch (error) {
    res.status(500).json({ error: 'Error saving personal info', details: error.message });
  }
};

// Step 2: Submit Employer Info
export const submitEmployerInfo = async (req, res) => {
  try {
    const { employerName, employerAddress, employerNTN } = req.body;
    const userId = req.user.id;

    const profile = await IRISProfile.findOneAndUpdate(
      { userId },
      { employerName, employerAddress, employerNTN },
      { new: true }
    );

    // Optional: Trigger NTN Registration API call here

    res.status(200).json({ message: 'Employer info saved', data: profile });
  } catch (error) {
    res.status(500).json({ error: 'Error saving employer info', details: error.message });
  }
};

// GET Profile
export const getIRISProfile = async (req, res) => {
  try {
    const profile = await IRISProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile', details: error.message });
  }
};
