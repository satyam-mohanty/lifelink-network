const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patientsController');

router.post('/', patientsController.addPatient);
router.get('/', patientsController.getPatients);
router.get('/:id', patientsController.getPatient);

module.exports = router;
