import VehicleDeduction from '../../models/deduction/vehicleDeduction.js';

export const createVehicleDeduction = async (req, res) => {
  try {
    const { userId, taxYear, activityType, vehicleType, registrationNumber, taxDeducted } = req.body;

    if (!userId || !taxYear || !activityType || !vehicleType || !registrationNumber || taxDeducted === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const entry = new VehicleDeduction({ userId, taxYear, activityType, vehicleType, registrationNumber, taxDeducted });
    await entry.save();

    res.status(201).json({ message: 'Vehicle deduction saved', data: entry });
  } catch (error) {
    res.status(500).json({ error: 'Server error while saving vehicle deduction' });
  }
};

export const getVehicleDeductionsByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;
    const data = await VehicleDeduction.find({ userId, taxYear });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching vehicle deductions' });
  }
};
