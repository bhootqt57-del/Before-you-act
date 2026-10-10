const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const decisionRoutes = require('./routes/decisionRoutes');

const app = express();

// Permissive CORS to allow Vercel and local clients
app.use(cors({ 
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '2mb' }));

// Health check endpoint accessible via /, /health, and /api/health
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'BEFORE YOU ACT — AI Decision Intelligence API',
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY || env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
};

app.get('/', healthHandler);
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// API routes
app.use('/api/decision', decisionRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

// Render injects PORT via process.env.PORT
const PORT = process.env.PORT || env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log("==================================================");
  console.log("  BEFORE YOU ACT — AI Decision Intelligence System");
  console.log("  Tagline: 'See the possibilities before you choose.'");
  console.log(`  Engine listening on port ${PORT}`);
  console.log(`  Gemini Key: ${(process.env.GEMINI_API_KEY || env.GEMINI_API_KEY) ? 'Active (Live AI)' : 'Not configured (Mock Engine Ready)'}`);
  console.log("==================================================");
});