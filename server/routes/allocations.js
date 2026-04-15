const express = require('express');
const router = express.Router();
const allocationsController = require('../controllers/allocationsController');

router.get('/', allocationsController.getAllocations);
router.get('/:id', allocationsController.getAllocation);
router.put('/:id/delivery', allocationsController.updateDelivery);

module.exports = router;
