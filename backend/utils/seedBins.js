const Bin = require('../models/Bin.model');

const initialBins = [
  { binId: 'BIN-101', location: 'Sector 4, Market Area', fillLevel: 85, temperature: '32°C', status: 'Critical' },
  { binId: 'BIN-102', location: 'Station Road, Zone 2', fillLevel: 40, temperature: '29°C', status: 'Normal' },
  { binId: 'BIN-103', location: 'University Campus Gate', fillLevel: 92, temperature: '35°C', status: 'Overflowing' },
  { binId: 'BIN-104', location: 'IT Park Avenue', fillLevel: 20, temperature: '28°C', status: 'Optimal' },
  { binId: 'BIN-105', location: 'Civil Lines, Block A', fillLevel: 68, temperature: '31°C', status: 'Normal' },
];

const seedDatabase = async () => {
  try {
    const count = await Bin.countDocuments();
    if (count === 0) {
      await Bin.insertMany(initialBins);
      console.log('🌱 Default Smart Bins data generated automatically!');
    } else {
      console.log('✅ Bins data already exists in database.');
    }
  } catch (err) {
    console.error('❌ Error seeding bins data:', err.message);
  }
};

module.exports = seedDatabase;