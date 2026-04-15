const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alertsController');

router.get('/', alertsController.getAlerts);
router.put('/:id/resolve', alertsController.resolveAlert);

module.exports = router;
