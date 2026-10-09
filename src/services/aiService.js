const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');
const { 
  MASTER_DECISION_PHILOSOPHY, 
  buildAnalysisPrompt, 
  buildAdversarialPrompt, 
  buildAnalystQAPrompt 
} = require('../prompts/systemPrompts');
const { getMockDecisionAnalysis } = require('./mockFallbackService');

let genAI = null;
if (env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
}

function extractAndParseJSON(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error("Empty AI response received");
  }
  try {
    return JSON.parse(rawText.trim());
  } catch (e) {}

  const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {}

  const firstBrace = rawText.indexOf('{');
  const lastBrace = rawText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
  }
  throw new Error("Unable to parse structured JSON from model output");
}

async function analyzeDecision(inputData) {
  if (!inputData || !inputData.decision || inputData.decision.trim().length < 5) {
    throw new Error("A valid decision description is required (min 5 characters).");
  }

  if (!genAI) {
    return getMockDecisionAnalysis(inputData.decision);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
      systemInstruction: MASTER_DECISION_PHILOSOPHY
    });

    const prompt = buildAnalysisPrompt(inputData);
    const result = await model.generateContent(prompt);
    return extractAndParseJSON(result.response.text());
  } catch (error) {
    console.error("[Before You Act] Upstream API issue, using heuristic fallback:", error.message);
    const fallback = getMockDecisionAnalysis(inputData.decision);
    fallback._note = "Heuristic fallback active.";
    return fallback;
  }
}

async function generateAdversarialChallenge(analysisData, preferredOptionTitle) {
  if (!genAI) {
    return {
      challengedOption: preferredOptionTitle || "Your Current Preferred Choice",
      steelmanCounterArgument: "The status quo bias and sunk-cost aversion may cause you to underestimate compounding friction.",
      overlookedRisk: "Opportunity cost of deferred momentum: Choosing the path of least resistance burns prime execution capacity.",
      cognitiveBiasHypothesis: "Confirmation bias: Searching for reasons to justify an emotionally convenient decision.",
      preMortemNarrative: "Fast-forward 18 months: Unverified assumptions hit real-world friction, causing budget overruns and regret.",
      invalidatingEvidence: "Interviews with individuals who abandoned this exact pathway due to hidden prerequisites.",
      adversarialRecommendation: "Execute a mandatory 14-day validation trial before signing agreements or burning bridges."
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
      systemInstruction: "You are an adversarial critical-thinking coach. Be direct, respectful, and rigorously skeptical. Return only valid JSON."
    });

    const prompt = buildAdversarialPrompt(analysisData, preferredOptionTitle);
    const result = await model.generateContent(prompt);
    return extractAndParseJSON(result.response.text());
  } catch (error) {
    return {
      challengedOption: preferredOptionTitle || "Selected Option",
      steelmanCounterArgument: "The hidden risk lies in assuming past momentum guarantees future adaptation.",
      overlookedRisk: "Underestimating the time required to regain stability after a major transition.",
      cognitiveBiasHypothesis: "Optimism bias regarding institutional turnaround times.",
      preMortemNarrative: "Execution stalls because dependencies were assumed rather than verified in writing.",
      invalidatingEvidence: "Official institutional data showing prolonged completion rates.",
      adversarialRecommendation: "Set a hard validation deadline: if requirements aren't confirmed in 14 days, pause."
    };
  }
}

async function queryDecisionAnalyst(analysisData, question) {
  if (!genAI) {
    return {
      analystAnswer: "Analyzing: The key bottleneck remains your unverified assumptions. Prioritize reducing high-impact uncertainty before debating peripheral risks.",
      relevantAssumptions: analysisData.assumptions ? analysisData.assumptions.slice(0, 2).map(a => a.statement) : [],
      recommendedInspectionStep: "Run the lowest-cost reversible experiment defined in your analysis."
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
      systemInstruction: MASTER_DECISION_PHILOSOPHY
    });

    const prompt = buildAnalystQAPrompt(analysisData, question);
    const result = await model.generateContent(prompt);
    return extractAndParseJSON(result.response.text());
  } catch (error) {
    return {
      analystAnswer: "Based on the structured decision tree, prioritize confirming whether consequences are reversible before committing capital.",
      relevantAssumptions: [],
      recommendedInspectionStep: "Review the 'What would change my mind' trigger conditions."
    };
  }
}

module.exports = {
  analyzeDecision,
  generateAdversarialChallenge,
  queryDecisionAnalyst
};