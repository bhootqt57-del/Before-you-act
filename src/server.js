const express = require('express');
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
  console.log(`  Engine listening at http://localhost:${env.PORT}`);
  console.log(`  Gemini API Key: ${env.GEMINI_API_KEY ? 'Active (Live AI)' : 'Not configured (Mock Engine Ready)'}`);
  console.log("==================================================");
});