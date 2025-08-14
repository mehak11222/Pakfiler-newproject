import BusinessIncorporation from '../../models/businessIncorporation/businessIncorporation.model.js';

export const createBusinessRequest = async (req, res) => {
  try {
    const {
      businessName,
      email,
      phoneNumber,
      irisPin,
      irisPassword,
      cessationDate,
      purpose,
    } = req.body;

    if (!businessName || !email || !phoneNumber || !purpose) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Handle uploaded documents
    const documents = {};
    if (req.files) {
      Object.entries(req.files).forEach(([key, fileArray]) => {
        if (fileArray?.length > 0) {
          documents[key] = fileArray[0].filename; // Save filename only
        }
      });
    }

    const newRequest = new BusinessIncorporation({
      userId: req.user.id, 
      businessName,
      email,
      phoneNumber,
      irisPin,
      irisPassword,
      cessationDate,
      purpose,
      documents,
    });

    await newRequest.save();

    res.status(201).json({
      message: 'Business request created successfully',
      data: newRequest,
    });
  } catch (err) {
    console.error('Business creation error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

export const getBusinessRequests = async (req, res) => {
  try {
    const records = await BusinessIncorporation.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(records);
  } catch (err) {
    console.error('Error fetching business requests:', err);
    res.status(500).json({ error: 'Error fetching requests' });
  }
};
