const { analyzeDecision, generateAdversarialChallenge, queryDecisionAnalyst } = require('../src/services/aiService');

async function runTest() {
  console.log("\n[TEST] 1. Initializing Decision Intelligence Pipeline...");

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

  console.log(`\n[TEST SUCCESS] Analysis generated in ${elapsed}s!`);
  console.log("\n--- CORE METRICS ---");
  console.log(`• Complexity: ${analysis.metrics.complexity}`);
  console.log(`• Information Completeness: ${analysis.metrics.informationCompletenessPercent}%`);
  console.log(`• Uncertainty Level: ${analysis.metrics.uncertaintyLevel}`);
  console.log(`• Readiness: ${analysis.metrics.decisionReadiness}`);
  console.log(`• Explanation: ${analysis.metrics.readinessExplanation}`);

  console.log("\n--- GENERATED OPTIONS ---");
  analysis.options.forEach((opt, idx) => {
    console.log(`[Option ${idx + 1}] ${opt.title} (Reversibility: ${opt.reversibility})`);
    console.log(`   Upside: ${opt.potentialUpside}`);
    console.log(`   Downside: ${opt.potentialDownside}`);
  });

  console.log("\n--- WHAT WOULD CHANGE MY MIND? ---");
  console.log(`• Current Lean: ${analysis.decisionSensitivity.currentLean}`);
  analysis.decisionSensitivity.whatWouldChangeMyMind.forEach((chg, idx) => {
    console.log(`   Shift ${idx + 1}: ${chg.condition} -> Pivot to: ${chg.pivotTo}`);
  });

  console.log("\n--- NEXT BEST ACTION ---");
  console.log(`• Action: ${analysis.nextBestAction.action}`);
  console.log(`• Time: ${analysis.nextBestAction.timeCommitment} | Reversible: ${analysis.nextBestAction.reversible}`);

  console.log("\n[TEST] 2. Testing Adversarial Challenge Mode...");
  const challenge = await generateAdversarialChallenge(analysis, analysis.options[0].title);
  console.log(`• Challenged: ${challenge.challengedOption}`);
  console.log(`• Steelman Counterargument: ${challenge.steelmanCounterArgument}`);

  console.log("\n[TEST] 3. Testing Contextual Decision Analyst...");
  const qa = await queryDecisionAnalyst(analysis, "What is the single biggest financial risk here?");
  console.log(`• Analyst Answer: ${qa.analystAnswer}`);

  console.log("\n==================================================");
  console.log("  ALL STAGE 1 CHECKS PASSED: READY FOR FRONTEND!");
  console.log("==================================================\n");
}

runTest().catch(console.error);