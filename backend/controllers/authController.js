const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

// 1. SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const unhashedToken = crypto.randomBytes(32).toString('hex');
    const verificationToken = crypto.createHash('sha256').update(unhashedToken).digest('hex');

    user = await User.create({
      name, email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${unhashedToken}&email=${email}`;
    await sendEmail({
      to: email,
      subject: 'Account Verification',
      text: `Please verify your account by clicking this link: ${verifyUrl}`
    });

    res.status(201).json({ message: 'Registration successful! Please check your email for verification.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;
    const verificationToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({ email, verificationToken, verificationTokenExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired verification token' });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ accessToken, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

  try {
    const user = await User.findOne({ refreshTokens: refreshToken });
    if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Expired refresh token' });
      const newAccessToken = generateAccessToken(user);
      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. LOGOUT
exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await User.updateOne({ refreshTokens: refreshToken }, { $pull: { refreshTokens: refreshToken } });
  }
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

// 6. FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const unhashedToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(unhashedToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${unhashedToken}&email=${user.email}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `Reset your password using this link: ${resetUrl}`
    });

    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({ email, resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshTokens = [];
    await user.save();

    res.status(200).json({ message: 'Password reset successful!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};