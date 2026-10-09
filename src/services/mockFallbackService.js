function getMockDecisionAnalysis(inputDecision = "") {
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
    },
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

module.exports = { getMockDecisionAnalysis };
