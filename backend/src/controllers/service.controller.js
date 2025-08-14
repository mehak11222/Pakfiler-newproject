// controllers/serviceCharge.controller.js
import ServiceCharge from '../models/ServiceCharge.js';

export const getServiceCharges = async (req, res) => {
  try {
    const charges = await ServiceCharge.find();
    res.json(charges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
