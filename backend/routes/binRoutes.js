const express = require('express');
const router = express.Router();
const { getAllBins, createBin } = require('../controllers/binController');

// Temporary bina middleware ke check karo
router.get('/', getAllBins);
router.post('/add', createBin);

module.exports = router;