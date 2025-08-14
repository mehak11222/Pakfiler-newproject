import NTNRegistration from '../../models/ntnRegistration/ntnRegistration.model.js';

export const createNTN = async (req, res) => {
  try {
    const {
      email, mobile, address, pin, password, sourceOfIncome,
      bankAccounts, employerName, employerAddress, employerNTN,
      cnicDocumentName
    } = req.body;

    const cnicFile = req.file?.path;

    const record = new NTNRegistration({
      userId: req.user.id,
      email,
      mobile,
      address,
      pin,
      password,
      sourceOfIncome,
      bankAccounts: JSON.parse(bankAccounts),
      employerName,
      employerAddress,
      employerNTN,
      cnicDocumentName,
      cnicFile
    });

    await record.save();
    res.status(201).json({ message: 'NTN Registration created', data: record });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// ✅ GET for logged-in user
export const getNTNByUser = async (req, res) => {
  try {
    const record = await NTNRegistration.findOne({ userId: req.user.id });
    if (!record) return res.status(404).json({ error: 'NTN profile not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch NTN record' });
  }
};

// ✅ GET by userId from param (e.g. /api/ntn/:userId)
export const getNTNByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const record = await NTNRegistration.findOne({ userId });
    if (!record) return res.status(404).json({ error: 'NTN profile not found' });
    res.status(200).json({ message: 'NTN profile fetched', data: record });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch NTN record by userId' });
  }
};
