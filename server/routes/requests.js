const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requestsController');

router.post('/blood', requestsController.createBloodRequest);
router.post('/organ', requestsController.createOrganRequest);
router.get('/', requestsController.getRequests);
router.get('/:type/:id', requestsController.getRequest);

module.exports = router;
