const express = require('express');
const router = express.Router();
const { handleAnalyze, handleChallenge, handleAnalystQuery } = require('../controllers/decisionController');

router.post('/analyze', handleAnalyze);
router.post('/challenge', handleChallenge);
router.post('/analyst', handleAnalystQuery);

module.exports = router;