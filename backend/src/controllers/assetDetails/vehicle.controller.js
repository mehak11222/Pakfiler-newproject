import VehicleAsset from '../../models/assetDetails/vehicle.model.js';

export const createVehicle = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // ✅ shows what you're receiving

    const { userId, taxYear, vehicleType, registrationNumber, cost } = req.body;

    if (!userId || !taxYear || !vehicleType || !registrationNumber || cost === undefined) {
      console.log('Validation failed');
      return res.status(400).json({ error: 'All fields are required' });
    }

    const record = new VehicleAsset({ userId, taxYear, vehicleType, registrationNumber, cost });

    await record.save();

    res.status(201).json({ message: 'Saved successfully', data: record });
  } catch (err) {
    console.error('Vehicle Save Error:', err); // ✅ this will show you what's wrong
    res.status(500).json({ error: err.message }); // ✅ show actual error in Postman
  }
};


export const getVehicleByUser = async (req, res) => {
  try {
    const { userId, taxYear } = req.query;
    const data = await VehicleAsset.find({ userId, taxYear });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
