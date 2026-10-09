const { 
  analyzeDecision, 
  generateAdversarialChallenge, 
  queryDecisionAnalyst 
} = require('../services/aiService');

async function handleAnalyze(req, res) {
  try {
    const { decision, category, currentSituation, goals, constraints, timeHorizon, location, riskTolerance, importance } = req.body;

    if (!decision || typeof decision !== 'string' || decision.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid decision description (at least 5 characters)."
      });
    }

    const analysis = await analyzeDecision({
      decision: decision.trim(),
      category,
      currentSituation,
      goals,
      constraints,
      timeHorizon,
      location,
      riskTolerance,
      importance
    });

    return res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function handleChallenge(req, res) {
  try {
    const { analysisData, preferredOptionTitle } = req.body;
    if (!analysisData || !analysisData.decision) {
      return res.status(400).json({ success: false, error: "Missing analysis data." });
    }
    const challenge = await generateAdversarialChallenge(analysisData, preferredOptionTitle);
    return res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function handleAnalystQuery(req, res) {
  try {
    const { analysisData, question } = req.body;
    if (!analysisData || !question) {
      return res.status(400).json({ success: false, error: "Context and question required." });
    }
    const answer = await queryDecisionAnalyst(analysisData, question);
    return res.status(200).json({ success: true, data: answer });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { handleAnalyze, handleChallenge, handleAnalystQuery };