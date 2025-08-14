import { ServiceCharge } from '../../models/ServiceCharge/serviceCharge.model.js';

// Create Service Charge
// controllers/ServiceCharge/serviceCharge.controller.js
export const createServiceCharge = async (req, res) => {
  try {
    const { category, services } = req.body;

    if (!category) return res.status(400).json({ error: 'Category is required' });
    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: 'At least one service is required' });
    }

    for (const service of services) {
      const { serviceName, fee, completionTime, requirements, contactMethods } = service;
      if (!serviceName || !fee || !completionTime || !requirements?.length || !contactMethods?.length) {
        return res.status(400).json({ error: 'Invalid service details' });
      }
    }

    const newEntry = await ServiceCharge.create({ category, services });
    
    // Fetch the complete entry to ensure all fields are returned
    const completeEntry = await ServiceCharge.findById(newEntry._id)
      .select('-__v -createdAt -updatedAt'); // Exclude these fields if you don't want them
    
    res.status(201).json({ 
      message: 'Service charge created successfully', 
      data: completeEntry 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
};

// Get All Service Charges
export const getAllServiceCharges = async (req, res) => {
  try {
    const entries = await ServiceCharge.find().lean();
    res.status(200).json({ data: entries });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service charges', details: error.message });
  }
};

// Get Predefined Categories
export const getServiceCategories = async (req, res) => {
  try {
    const categories = [
      'NTN Registration Services',
      'Tax Filing Services',
      'Sales Tax Registration Services',
      'Company Registration Services',
      'Provident and Gratuity Fund Services',
      'USA Company Services',
      'Custom'
    ];
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
};
export const updateServiceCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ServiceCharge.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Service charge not found' });
    res.status(200).json({ message: 'Service charge updated', data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service charge', details: error.message });
  }
};

export const deleteServiceCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ServiceCharge.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Service charge not found' });
    res.status(200).json({ message: 'Service charge deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service charge', details: error.message });
  }
};
export const getServiceChargeCount = async (req, res) => {
  try {
    const count = await ServiceCharge.countDocuments();
    res.status(200).json({ total: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to count service charges', details: error.message });
  }
};
