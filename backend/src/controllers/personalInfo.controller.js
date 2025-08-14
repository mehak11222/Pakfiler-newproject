// File: src/controllers/personalInfo.controller.js
import PersonalInfo from '../models/PersonalInfo.js';
// File: src/controllers/personalInfo.controller.js
export const submitPersonalInfo = async (req, res) => {
  try {
    const info = new PersonalInfo({
      filingId: req.body.filingId, // Changed from userId
      fullName: req.body.fullName,
      email: req.body.email,
      cnic: req.body.cnic,
      dateOfBirth: req.body.dateOfBirth,
      nationality: req.body.nationality,
      residentialStatus: req.body.residentialStatus,
      occupation: req.body.occupation,
    });

    await info.save();
    res.status(201).json({ message: 'Personal info submitted', info });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting personal info', error: error.message });
  }
};

export const getPersonalInfo = async (req, res) => {
  try {
    const info = await PersonalInfo.find({ filingId: req.params.filingId }); // Changed from userId
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving personal info', error: error.message });
  }
};
