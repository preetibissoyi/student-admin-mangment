const express = require('express');
const studentProfileController = require('../controllers/studentProfileController');
const router = express.Router();

// Get student profile
router.get('/:id/profile', studentProfileController.getProfile);

// Request profile update
router.post('/:id/update-request', studentProfileController.requestUpdate);

// Get update request history
router.get('/:id/update-history', studentProfileController.getUpdateHistory);

// Get pending update requests
router.get('/:id/pending-requests', studentProfileController.getPendingRequests);

module.exports = router; 