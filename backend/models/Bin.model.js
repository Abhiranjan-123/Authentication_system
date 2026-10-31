const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  binId: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  fillLevel: { type: Number, required: true, min: 0, max: 100 },
  temperature: { type: String, required: true },
  status: { type: String, enum: ['Optimal', 'Normal', 'Critical', 'Overflowing'], default: 'Normal' },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Bin', binSchema);