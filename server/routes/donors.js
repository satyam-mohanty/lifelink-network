const express = require('express');
const router = express.Router();
const donorsController = require('../controllers/donorsController');

router.post('/', donorsController.registerDonor);
router.get('/', donorsController.getDonors);
router.get('/:id', donorsController.getDonor);
router.put('/:id/eligibility', donorsController.updateEligibility);
router.post('/:id/health', donorsController.addHealthRecord);
router.get('/:id/donations', donorsController.getDonations);

module.exports = router;
