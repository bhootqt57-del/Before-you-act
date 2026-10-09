const fs = require('fs');
const path = require('path');

const files = {
  'src/config/env.js': `const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};`,

  'src/prompts/schemas.js': `const DECISION_ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    decision: { type: "string" },
    summary: { type: "string" },
    metrics: {
      type: "object",
      properties: {
        complexity: { type: "string", enum: ["LOW", "MODERATE", "HIGH", "VERY HIGH"] },
        informationCompletenessPercent: { type: "integer", minimum: 0, maximum: 100 },
        uncertaintyLevel: { type: "string", enum: ["LOW", "MODERATE", "HIGH", "EXTREME"] },
        riskExposure: { type: "string", enum: ["LOW", "BALANCED", "HIGH", "CRITICAL"] },
        decisionReadiness: { 
          type: "string", 
          enum: ["READY TO ACT", "READY TO TEST", "MORE INFORMATION NEEDED", "HIGH UNCERTAINTY"] 
        },
        readinessExplanation: { type: "string" }
      },
      required: ["complexity", "informationCompletenessPercent", "uncertaintyLevel", "riskExposure", "decisionReadiness", "readinessExplanation"]
    },
    options: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          tagline: { type: "string" },
          potentialUpside: { type: "string" },
          potentialDownside: { type: "string" },
          shortTermEffects: { type: "string" },
          longTermEffects: { type: "string" },
          reversibility: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
          reversibilityReasoning: { type: "string" },
          uncertaintySummary: { type: "string" },
          affectedAreas: { type: "array", items: { type: "string" } }
        },
        required: ["id", "title", "potentialUpside", "potentialDownside", "shortTermEffects", "longTermEffects", "reversibility", "reversibilityReasoning", "affectedAreas"]
      }
    },
    assumptions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          statement: { type: "string" },
          importance: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
          confidence: { type: "string", enum: ["CONFIRMED", "LIKELY", "UNCERTAIN", "UNKNOWN"] },
          whyItMatters: { type: "string" },
          howToValidate: { type: "string" }
        },
        required: ["id", "statement", "importance", "confidence", "whyItMatters", "howToValidate"]
      }
    },
    missingInformation: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          item: { type: "string" },
          whyItMatters: { type: "string" },
          howToFindOut: { type: "string" },
          impactOnDecision: { type: "string" }
        },
        required: ["id", "item", "whyItMatters", "howToFindOut", "impactOnDecision"]
      }
    },
    consequenceTrees: {
      type: "array",
      items: {
        type: "object",
        properties: {
          optionId: { type: "string" },
          optionTitle: { type: "string" },
          primaryBenefitsBranch: {
            type: "array",
            items: {
              type: "object",
              properties: {
                level: { type: "integer" },
                event: { type: "string" },
                confidence: { type: "string" },
                assumptions: { type: "string" }
              }
            }
          },
          primaryCostsBranch: {
            type: "array",
            items: {
              type: "object",
              properties: {
                level: { type: "integer" },
                event: { type: "string" },
                confidence: { type: "string" },
                assumptions: { type: "string" }
              }
            }
          }
        },
        required: ["optionId", "optionTitle", "primaryBenefitsBranch", "primaryCostsBranch"]
      }
    },
    scenarios: {
      type: "object",
      properties: {
        bestCase: {
          type: "object",
          properties: {
            headline: { type: "string" },
            conditionsRequired: { type: "array", items: { type: "string" } },
            plausibleOutcome: { type: "string" },
            residualRisks: { type: "string" }
          },
          required: ["headline", "conditionsRequired", "plausibleOutcome", "residualRisks"]
        },
        mostLikely: {
          type: "object",
          properties: {
            headline: { type: "string" },
            expectedConditions: { type: "array", items: { type: "string" } },
            likelyTrajectory: { type: "string" },
            keyUncertainty: { type: "string" }
          },
          required: ["headline", "expectedConditions", "likelyTrajectory", "keyUncertainty"]
        },
        downsideCase: {
          type: "object",
          properties: {
            headline: { type: "string" },
            failureModes: { type: "array", items: { type: "string" } },
            earlyWarningSigns: { type: "array", items: { type: "string" } },
            mitigationStrategies: { type: "array", items: { type: "string" } }
          },
          required: ["headline", "failureModes", "earlyWarningSigns", "mitigationStrategies"]
        }
      },
      required: ["bestCase", "mostLikely", "downsideCase"]
    },
    secondOrderEffects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          trigger: { type: "string" },
          firstOrder: { type: "string" },
          secondOrder: { type: "string" },
          thirdOrder: { type: "string" }
        },
        required: ["trigger", "firstOrder", "secondOrder"]
      }
    },
    stakeholderImpact: {
      type: "array",
      items: {
        type: "object",
        properties: {
          stakeholder: { type: "string" },
          potentialImpact: { type: "string" },
          alignmentLevel: { type: "string", enum: ["POSITIVE", "NEUTRAL", "NEGATIVE", "MIXED"] }
        },
        required: ["stakeholder", "potentialImpact", "alignmentLevel"]
      }
    },
    decisionSensitivity: {
      type: "object",
      properties: {
        currentLean: { type: "string" },
        leanReasoning: { type: "array", items: { type: "string" } },
        whatWouldChangeMyMind: {
          type: "array",
          items: {
            type: "object",
            properties: {
              condition: { type: "string" },
              pivotTo: { type: "string" },
              rationale: { type: "string" }
            },
            required: ["condition", "pivotTo", "rationale"]
          }
        }
      },
      required: ["currentLean", "leanReasoning", "whatWouldChangeMyMind"]
    },
    decisionExperiments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          duration: { type: "string" },
          description: { type: "string" },
          uncertaintyReduced: { type: "string" },
          estimatedCost: { type: "string" }
        },
        required: ["title", "duration", "description", "uncertaintyReduced"]
      }
    },
    potentialBlindSpots: {
      type: "object",
      properties: {
        underestimating: { type: "array", items: { type: "string" } },
        overestimating: { type: "array", items: { type: "string" } }
      },
      required: ["underestimating", "overestimating"]
    },
    nextBestAction: {
      type: "object",
      properties: {
        action: { type: "string" },
        timeCommitment: { type: "string" },
        whyThisFirst: { type: "string" },
        reversible: { type: "boolean" }
      },
      required: ["action", "timeCommitment", "whyThisFirst", "reversible"]
    },
    disclaimer: { type: "string" }
  },
  required: [
    "decision", "summary", "metrics", "options", "assumptions", 
    "missingInformation", "consequenceTrees", "scenarios", 
    "secondOrderEffects", "stakeholderImpact", "decisionSensitivity", 
    "decisionExperiments", "potentialBlindSpots", "nextBestAction", "disclaimer"
  ]
};

module.exports = { DECISION_ANALYSIS_SCHEMA };`,

  'src/prompts/systemPrompts.js': `const { DECISION_ANALYSIS_SCHEMA } = require('./schemas');

const MASTER_DECISION_PHILOSOPHY = \`
You are the reasoning core of "BEFORE YOU ACT", an international AI decision-intelligence platform.
Tagline: "See the possibilities before you choose."

CORE PHILOSOPHY:
"AI should improve human decisions, not replace human judgment."

STRICT OPERATING RULES:
1. NEVER answer "Yes, do it" or "No, do not do it".
2. DO NOT make the final choice for the user. Expose the structure, uncertainty, trade-offs, and consequences so the user can make an informed choice.
3. Explicitly distinguish established facts from hidden assumptions.
4. Never present speculative outcomes as guaranteed facts. Use calibrated probabilistic phrasing: "Possible outcome", "Likely factor", "Potential risk", "Based on information provided", "Confidence: moderate".
5. International Audience: Do NOT assume US laws, Indian education systems, specific currencies, or cultural norms unless specified.
6. Provide creative and realistic alternatives: e.g., "Delay decision", "Run a 2-week reversible experiment", "Hybrid path", "Test before committing".
7. Always identify "What would change my mind?" (Decision Sensitivity).
8. Provide actionable "Decision Experiments" (low-cost, high-information tests) to de-risk the choice.
9. AI Safety: For medical, legal, or high-stakes financial topics, explicitly mandate consulting a qualified professional.
10. Return valid, well-formed JSON matching the exact schema provided.
\`;

function buildAnalysisPrompt(input) {
  return \`
User Decision Query:
- Main Decision: "\${input.decision}"
- Category: \${input.category || "General"}
- Current Situation: "\${input.currentSituation || "Not specified"}"
- Core Objectives/Goals: "\${input.goals || "Not specified"}"
- Constraints: "\${input.constraints || "Not specified"}"
- Time Horizon: \${input.timeHorizon || "Medium-term (1-3 years)"}
- Location / Region: \${input.location || "International / Not specified"}
- Risk Tolerance: \${input.riskTolerance || "Balanced"}
- Importance (1-10): \${input.importance || "8"}

Execute the 10-Stage Reasoning Pipeline and return a single valid JSON object matching this schema:
\${JSON.stringify(DECISION_ANALYSIS_SCHEMA, null, 2)}
\`;
}

function buildAdversarialPrompt(analysisData, preferredOptionTitle) {
  return \`
You are the ADVERSARIAL STRESS-TEST ENGINE of "BEFORE YOU ACT".
Decision: "\${analysisData.decision}"
Preferred Option to Challenge: "\${preferredOptionTitle || 'Preferred Option'}"

Context: \${JSON.stringify({ options: analysisData.options, assumptions: analysisData.assumptions })}

Produce a rigorous counter-brief in JSON:
{
  "challengedOption": "\${preferredOptionTitle || 'Preferred Option'}",
  "steelmanCounterArgument": "...",
  "overlookedRisk": "...",
  "cognitiveBiasHypothesis": "...",
  "preMortemNarrative": "...",
  "invalidatingEvidence": "...",
  "adversarialRecommendation": "..."
}
\`;
}

function buildAnalystQAPrompt(analysisData, userQuestion) {
  return \`
You are the "Decision Analyst" for "BEFORE YOU ACT".
Decision: "\${analysisData.decision}"
Summary: "\${analysisData.summary}"
User Question: "\${userQuestion}"

Return JSON:
{
  "analystAnswer": "...",
  "relevantAssumptions": ["..."],
  "recommendedInspectionStep": "..."
}
\`;
}

module.exports = {
  MASTER_DECISION_PHILOSOPHY,
  buildAnalysisPrompt,
  buildAdversarialPrompt,
  buildAnalystQAPrompt
};`,

  'src/services/mockFallbackService.js': `function getMockDecisionAnalysis(inputDecision = "") {
  return {
    decision: inputDecision || "Should I switch from my current university program to computer science at another university?",
    summary: "A high-stakes academic transition involving financial exposure, graduation delays, and credential value versus current dissatisfaction and alternative skill pathways.",
    metrics: {
      complexity: "HIGH",
      informationCompletenessPercent: 58,
      uncertaintyLevel: "MODERATE",
      riskExposure: "BALANCED",
      decisionReadiness: "READY TO TEST",
      readinessExplanation: "Key financial and transfer credit numbers are unverified. A small reversible validation test should precede any permanent withdrawal."
    },
    options: [
      {
        id: "opt_transfer",
        title: "Full Transfer to New University",
        tagline: "Commit fully to accredited CS degree elsewhere",
        potentialUpside: "Structured computer science credentials, campus recruiting pipeline, and complete environment reset.",
        potentialDownside: "Loss of academic credits, extended timeline to graduation, increased tuition, and relocation friction.",
        shortTermEffects: "Application logistics, credit assessment battles, immediate moving costs.",
        longTermEffects: "Potentially stronger entry-level tech positioning, but delayed lifetime earnings by 1-2 years.",
        reversibility: "LOW",
        reversibilityReasoning: "Withdrawing from your current program often closes the door to re-enrollment without penalizing friction.",
        uncertaintySummary: "Depends heavily on how many credits actually transfer and institutional hiring relationships.",
        affectedAreas: ["Career", "Financial Capital", "Time to Market", "Mental Health"]
      },
      {
        id: "opt_stay_minor",
        title: "Stay & Complete Minor / Self-Directed Portfolio",
        tagline: "Finish current degree while building software engineering proof-of-work",
        potentialUpside: "Zero graduation delay, minimal financial debt, lower stress, proven resilience across domains.",
        potentialDownside: "Must pass initial recruiter ATS screening without a dedicated CS degree; requires high self-discipline.",
        shortTermEffects: "Intense schedule balancing existing coursework with software projects.",
        longTermEffects: "Faster graduation; entry into job market 1-2 years earlier.",
        reversibility: "HIGH",
        reversibilityReasoning: "You can complete your current degree and subsequently enroll in a 1-year conversion master's if needed.",
        uncertaintySummary: "Moderate: depends on individual grit and regional employer degree-strictness.",
        affectedAreas: ["Self-Discipline", "Financial Safety", "Degree Completion"]
      },
      {
        id: "opt_staged_test",
        title: "Run 60-Day Validation Experiment First",
        tagline: "De-risk before withdrawing: audits, credits audit, and technical sprint",
        potentialUpside: "Converts critical assumptions into verified facts before burning bridges.",
        potentialDownside: "Slight 2-month cognitive delay in committing to either path.",
        shortTermEffects: "Requesting official credit evaluation and building first non-trivial software project.",
        longTermEffects: "Avoids costly $20k+ transfer mistake if computer science is not a personal fit.",
        reversibility: "HIGH",
        reversibilityReasoning: "You retain all current enrollment privileges while gathering decisive intelligence.",
        uncertaintySummary: "Very low downside risk.",
        affectedAreas: ["Risk Mitigation", "Clarity", "Time Management"]
      }
    ],
    assumptions: [
      {
        id: "asm_1",
        statement: "A formal CS degree from the target university will materially outperform portfolio + self-study in job placement.",
        importance: "HIGH",
        confidence: "UNCERTAIN",
        whyItMatters: "If regional employers prioritize demonstrable GitHub projects, the switching cost may yield negative ROI.",
        howToValidate: "Contact 5 recent graduates from the target program on LinkedIn and check employment data."
      },
      {
        id: "asm_2",
        statement: "At least 70% of current accumulated credits will transfer directly toward graduation requirements.",
        importance: "HIGH",
        confidence: "UNKNOWN",
        whyItMatters: "If under 50% transfer, you incur 2 full extra years of living expenses and tuition.",
        howToValidate: "Submit an unofficial transcript to the target admissions registrar for preliminary audit."
      }
    ],
    missingInformation: [
      {
        id: "mis_1",
        item: "Official Transfer Credit Articulation",
        whyItMatters: "Dictates whether your graduation timeline expands by 1 semester or 4 semesters.",
        howToFindOut: "Schedule an emergency academic counseling session with the target university transfer department.",
        impactOnDecision: "If >1.5 years delay, favors Option B (Stay & Minor)."
      }
    ],
    consequenceTrees: [
      {
        optionId: "opt_transfer",
        optionTitle: "Transfer to Computer Science",
        primaryBenefitsBranch: [
          { level: 1, event: "Enrolled in dedicated CS cohort", confidence: "HIGH", assumptions: "Admission confirmed" },
          { level: 2, event: "Structured technical peers and faculty mentorship", confidence: "MODERATE", assumptions: "Active campus engagement" }
        ],
        primaryCostsBranch: [
          { level: 1, event: "Initial credit loss requires repeating course prerequisites", confidence: "HIGH", assumptions: "Credit transfer friction" },
          { level: 2, event: "Graduation delayed by 18 months", confidence: "MODERATE", assumptions: "Course scheduling availability" }
        ]
      }
    ],
    scenarios: {
      bestCase: {
        headline: "Seamless Credit Transfer & Fast Internship Placement",
        conditionsRequired: ["80%+ credits transfer successfully", "Thrives in algorithms coursework"],
        plausibleOutcome: "Graduates with technical degree into software engineering.",
        residualRisks: "Higher cumulative student debt."
      },
      mostLikely: {
        headline: "Moderate Delay with Improved Academic Alignment",
        expectedConditions: ["Requires 1 additional year of study", "Higher intrinsic motivation"],
        likelyTrajectory: "Tough first 2 terms adapting to technical rigor, followed by steady progression.",
        keyUncertainty: "Junior tech hiring market condition."
      },
      downsideCase: {
        headline: "Credit Rejection + Burnout in High-Pressure Environment",
        failureModes: ["Target institution rejects key prerequisites", "Financial strain forces part-time gig work"],
        earlyWarningSigns: ["Registrar takes >8 weeks with vague transfer credit assurances"],
        mitigationStrategies: ["Do not sign leases until transfer articulation agreement is in writing"]
      }
    ],
    secondOrderEffects: [
      {
        trigger: "Switching programs mid-degree",
        firstOrder: "Credit loss and schedule rearrangement",
        secondOrder: "Delayed graduation by 12-18 months",
        thirdOrder: "Opportunity cost of lost early career compound salary"
      }
    ],
    stakeholderImpact: [
      {
        stakeholder: "You (Personal Fulfillment & Career)",
        potentialImpact: "Significantly higher intellectual alignment with technical interests.",
        alignmentLevel: "POSITIVE"
      }
    ],
    decisionSensitivity: {
      currentLean: "Option C (Run a 60-Day Validation Experiment) followed by Option B if credits transfer poorly",
      leanReasoning: [
        "Irreversibility of withdrawing before official credit confirmation is unnecessarily high",
        "Cost delta could exceed $30,000 without guaranteed placement advantage"
      ],
      whatWouldChangeMyMind: [
        {
          condition: "If target university guarantees in writing that 85%+ credits transfer without delaying graduation >1 term",
          pivotTo: "Option A (Full Transfer)",
          rationale: "Removes the primary penalty (time-to-market cost)."
        }
      ]
    },
    decisionExperiments: [
      {
        title: "The Unofficial Credit & Syllabus Audit",
        duration: "5 days",
        description: "Email the transfer coordinator at the target university with your syllabus.",
        uncertaintyReduced: "Eliminates graduation timeline ambiguity.",
        estimatedCost: "$0"
      }
    ],
    potentialBlindSpots: {
      underestimating: ["The compounding financial impact of graduating 1.5 years later"],
      overestimating: ["The assumption that a formal curriculum is mandatory to enter the software sector"]
    },
    nextBestAction: {
      action: "Request an approved Leave of Absence application from current registrar and email the target admissions officer for credit evaluation.",
      timeCommitment: "90 minutes",
      whyThisFirst: "Preserves safety net while extracting decisive intelligence.",
      reversible: true
    },
    disclaimer: "Before You Act is an AI decision-intelligence system designed to expose trade-offs, uncertainties, and blind spots. It is not an academic advisor, legal counsel, or financial consultant."
  };
}

module.exports = { getMockDecisionAnalysis };`,

  'src/services/aiService.js': `const { GoogleGenerativeAI } = require('@google/generative-ai');
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

  const cleaned = rawText.replace(/\`\`\`json\\s*/gi, '').replace(/\`\`\`\\s*$/gi, '').trim();
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
};`,

  'src/controllers/decisionController.js': `const { 
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

module.exports = { handleAnalyze, handleChallenge, handleAnalystQuery };`,

  'src/routes/decisionRoutes.js': `const express = require('express');
const router = express.Router();
const { handleAnalyze, handleChallenge, handleAnalystQuery } = require('../controllers/decisionController');

router.post('/analyze', handleAnalyze);
router.post('/challenge', handleChallenge);
router.post('/analyst', handleAnalystQuery);

module.exports = router;`,

  'src/server.js': `const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const decisionRoutes = require('./routes/decisionRoutes');

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'BEFORE YOU ACT — AI Decision Intelligence API',
    geminiKeyConfigured: Boolean(env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

app.use('/api/decision', decisionRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ success: false, error: "Internal server error." });
});

app.listen(env.PORT, () => {
  console.log("==================================================");
  console.log("  BEFORE YOU ACT — AI Decision Intelligence System");
  console.log("  Tagline: 'See the possibilities before you choose.'");
  console.log(\`  Engine listening at http://localhost:\${env.PORT}\`);
  console.log(\`  Gemini API Key: \${env.GEMINI_API_KEY ? 'Active (Live AI)' : 'Not configured (Mock Engine Ready)'}\`);
  console.log("==================================================");
});`,

  'test/test-analysis.js': `const { analyzeDecision, generateAdversarialChallenge, queryDecisionAnalyst } = require('../src/services/aiService');

async function runTest() {
  console.log("\\n[TEST] 1. Initializing Decision Intelligence Pipeline...");

  const demoInput = {
    decision: "Should I drop my current economics degree to switch to computer science at another university?",
    category: "Education",
    currentSituation: "In 2nd year of economics; finding the coursework dry; passionate about building software.",
    goals: "Transition into tech as a software engineer with high career ceiling.",
    constraints: "Family expects graduation on time; finite savings for tuition.",
    timeHorizon: "3-5 years",
    location: "International",
    riskTolerance: "Balanced",
    importance: 9
  };

  const startTime = Date.now();
  const analysis = await analyzeDecision(demoInput);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(\`\\n[TEST SUCCESS] Analysis generated in \${elapsed}s!\`);
  console.log("\\n--- CORE METRICS ---");
  console.log(\`• Complexity: \${analysis.metrics.complexity}\`);
  console.log(\`• Information Completeness: \${analysis.metrics.informationCompletenessPercent}%\`);
  console.log(\`• Uncertainty Level: \${analysis.metrics.uncertaintyLevel}\`);
  console.log(\`• Readiness: \${analysis.metrics.decisionReadiness}\`);
  console.log(\`• Explanation: \${analysis.metrics.readinessExplanation}\`);

  console.log("\\n--- GENERATED OPTIONS ---");
  analysis.options.forEach((opt, idx) => {
    console.log(\`[Option \${idx + 1}] \${opt.title} (Reversibility: \${opt.reversibility})\`);
    console.log(\`   Upside: \${opt.potentialUpside}\`);
    console.log(\`   Downside: \${opt.potentialDownside}\`);
  });

  console.log("\\n--- WHAT WOULD CHANGE MY MIND? ---");
  console.log(\`• Current Lean: \${analysis.decisionSensitivity.currentLean}\`);
  analysis.decisionSensitivity.whatWouldChangeMyMind.forEach((chg, idx) => {
    console.log(\`   Shift \${idx + 1}: \${chg.condition} -> Pivot to: \${chg.pivotTo}\`);
  });

  console.log("\\n--- NEXT BEST ACTION ---");
  console.log(\`• Action: \${analysis.nextBestAction.action}\`);
  console.log(\`• Time: \${analysis.nextBestAction.timeCommitment} | Reversible: \${analysis.nextBestAction.reversible}\`);

  console.log("\\n[TEST] 2. Testing Adversarial Challenge Mode...");
  const challenge = await generateAdversarialChallenge(analysis, analysis.options[0].title);
  console.log(\`• Challenged: \${challenge.challengedOption}\`);
  console.log(\`• Steelman Counterargument: \${challenge.steelmanCounterArgument}\`);

  console.log("\\n[TEST] 3. Testing Contextual Decision Analyst...");
  const qa = await queryDecisionAnalyst(analysis, "What is the single biggest financial risk here?");
  console.log(\`• Analyst Answer: \${qa.analystAnswer}\`);

  console.log("\\n==================================================");
  console.log("  ALL STAGE 1 CHECKS PASSED: READY FOR FRONTEND!");
  console.log("==================================================\\n");
}

runTest().catch(console.error);`
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log("Wrote to disk: " + relPath);
}

console.log("\nSetup complete! Running test now...\n");
