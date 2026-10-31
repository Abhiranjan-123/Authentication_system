const Bin = require('../models/Bin.model');

const getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find({});
    const totalBins = bins.length;
    const criticalBins = bins.filter(b => b.status === 'Critical' || b.status === 'Overflowing').length;
    
    res.status(200).json({
      success: true,
      stats: {
        totalBins,
        criticalBins,
        optimizedRoutes: '89%',
        co2Saved: '1.2 Tons'
      },
      bins
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createBin = async (req, res) => {
  try {
    const { binId, location, fillLevel, temperature, status } = req.body;
    const newBin = new Bin({ binId, location, fillLevel, temperature, status });
    await newBin.save();
    res.status(201).json({ success: true, message: 'Bin added successfully', bin: newBin });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Yeh export hona zaroori hai
module.exports = { getAllBins, createBin };