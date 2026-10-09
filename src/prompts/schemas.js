const DECISION_ANALYSIS_SCHEMA = {
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

module.exports = { DECISION_ANALYSIS_SCHEMA };