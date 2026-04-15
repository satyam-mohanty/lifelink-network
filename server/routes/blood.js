const express = require('express');
const router = express.Router();
const bloodController = require('../controllers/bloodController');

router.post('/', bloodController.addBloodBag);
router.get('/', bloodController.getBloodBags);
router.get('/summary', bloodController.getBloodSummary);
router.get('/:id', bloodController.getBloodBag);
router.put('/:id/status', bloodController.updateStatus);
router.post('/expire-check', bloodController.expireCheck);

module.exports = router;
