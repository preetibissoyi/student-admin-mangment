const express = require('express');
const studentAuthController = require('../controllers/studentAuthController');
const studentAuth = require('../middleware/studentAuth');
const router = express.Router();

// Student login
router.post('/login', studentAuthController.login);

// Get current student profile (protected route)
router.get('/me', studentAuth.protect, studentAuthController.getMe);

module.exports = router; 