import GSTRegistration from '../../models/gst/gstRegistration.model.js';

// Create or Update Business Details (Step 1)
export const saveGSTBusinessDetails = async (req, res) => {
  try {
    const { businessName, businessType, startDate, businessNature, description, consumerNumber } = req.body;

    let record = await GSTRegistration.findOne({ userId: req.user.id, status: 'pending' });

    if (record) {
      record.set({ businessName, businessType, startDate, businessNature, description, consumerNumber });
      await record.save();
      return res.status(200).json({ message: 'Business details updated', data: record });
    }

    record = new GSTRegistration({
      userId: req.user.id,
      businessName,
      businessType,
      startDate,
      businessNature,
      description,
      consumerNumber
    });

    await record.save();
    res.status(201).json({ message: 'Business details saved', data: record });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Upload Document (Step 2)
export const uploadGSTDocument = async (req, res) => {
  try {
    const { docType } = req.body;
    const files = req.files;

    if (!docType || !files || files.length === 0) {
      return res.status(400).json({ error: 'Document type and files required' });
    }

    const record = await GSTRegistration.findOne({ userId: req.user.id, status: 'pending' });
    if (!record) return res.status(404).json({ error: 'GST registration not found' });

    const doc = record.documents.find(d => d.docType === docType);
    const newPaths = files.map(file => file.path);

    if (doc) {
      doc.filePaths.push(...newPaths);
    } else {
      record.documents.push({ docType, filePaths: newPaths });
    }

    await record.save();
    res.status(200).json({ message: 'Document uploaded', data: record.documents });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Submit GST (Step 3)
export const submitGST = async (req, res) => {
  try {
    const record = await GSTRegistration.findOne({ userId: req.user.id, status: 'pending' });
    if (!record) return res.status(404).json({ error: 'GST registration not found' });

    record.status = 'submitted';
    record.submittedAt = new Date();
    await record.save();

    res.status(200).json({ message: 'GST registration submitted', data: record });
  } catch (err) {
    res.status(500).json({ error: 'Submission failed', details: err.message });
  }
};

// View All Registrations
export const getGSTRegistrations = async (req, res) => {
  try {
    const list = await GSTRegistration.find({ userId: req.user.id });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch GST registrations' });
  }
};
