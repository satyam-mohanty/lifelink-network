const express = require('express');
const router = express.Router();
const organsController = require('../controllers/organsController');

router.post('/', organsController.registerOrgan);
router.get('/', organsController.getOrgans);
router.get('/:id', organsController.getOrgan);
router.put('/:id/status', organsController.updateStatus);

module.exports = router;
