const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');

router.post('/match/blood', matchingController.matchBlood);
router.post('/match/organ', matchingController.matchOrgan);
router.post('/allocate/blood', matchingController.allocateBlood);
router.post('/allocate/organ', matchingController.allocateOrgan);

module.exports = router;
