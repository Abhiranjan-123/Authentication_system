const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {
  signup, verifyEmail, login, refreshToken, logout, forgotPassword, resetPassword
} = require('../controllers/authController');

router.post('/signup', signup);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
  try {
    const user = req.user;
    const refreshTokenVal = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    
    user.refreshTokens.push(refreshTokenVal);
    await user.save();

    res.cookie('refreshToken', refreshTokenVal, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
   res.redirect(`${process.env.FRONTEND_URL}/dashboard1?token=${accessToken}`);
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=OAuthFailed`);
  }
});

module.exports = router;