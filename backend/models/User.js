const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String }, // Google OAuth users ke liye optional hai
  googleId: { type: String, default: null },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  refreshTokens: [{ type: String }] // Multi-device login support ke liye
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);