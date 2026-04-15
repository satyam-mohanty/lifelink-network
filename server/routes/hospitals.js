const express = require('express');
const router = express.Router();
const hospitalsController = require('../controllers/hospitalsController');

router.post('/', hospitalsController.registerHospital);
router.get('/', hospitalsController.getHospitals);
router.get('/:id', hospitalsController.getHospital);
router.put('/:id/verify', hospitalsController.verifyHospital);

module.exports = router;
