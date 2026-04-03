require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require("path");
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve frontend files (IMPORTANT)
app.use(express.static(__dirname));

// ✅ Root route → show index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// ================= GEMINI FUNCTIONS =================

// Generate roadmap using Gemini
async function generateRoadmap(skill) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a career advisor and learning expert. Generate a 6-step learning roadmap for "${skill}" structured by difficulty levels.

Format exactly as:
1. [Beginner step]
2. [Beginner step] 
3. [Intermediate step]
4. [Intermediate step]
5. [Advanced step]
6. [Advanced step]

Requirements:
- Each step must be concise and actionable
- Maximum 8 words per step
- No explanations or extra text
- Only return the numbered list
- Focus on practical learning progression

Skill: ${skill}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const steps = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && /^\d+/.test(line))
      .map(line =>
        line
          .replace(/^\d+\.\s*/, '')
          .replace(/^\d+\)\s*/, '')
          .replace(/^\d+\.\s*/, '')
          .replace(/^-\s*/, '')
          .replace(/^\*\s*/, '')
          .replace(/\[.*?\]/g, '')
          .replace(/[""''']/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      )
      .filter(step => step.length > 0)
      .slice(0, 6);

    if (steps.length === 0) {
      return [
        `Start with basic ${skill} fundamentals`,
        `Practice ${skill} exercises regularly`,
        `Build ${skill} projects`,
        `Study advanced ${skill} concepts`,
        `Join ${skill} communities`,
        `Stay updated with ${skill} trends`
      ];
    }

    return steps;

  } catch (error) {
    return [
      `Start with basic ${skill} fundamentals`,
      `Practice ${skill} exercises regularly`,
      `Build ${skill} projects`,
      `Study advanced ${skill} concepts`,
      `Join ${skill} communities`,
      `Stay updated with ${skill} trends`
    ];
  }
}

// Generate job tips
async function generateJobTips(role) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a career coach. Generate 5 short preparation tips for "${role}" job position.

Format exactly as:
1. [Tip]
2. [Tip]
3. [Tip]
4. [Tip]
5. [Tip]

Requirements:
- Each tip must be under 10 words
- No explanations
- Only numbered list

Role: ${role}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const tips = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && /^\d+/.test(line))
      .map(line =>
        line
          .replace(/^\d+\.\s*/, '')
          .replace(/^\d+\)\s*/, '')
          .replace(/\s+/g, ' ')
          .trim()
      )
      .slice(0, 5);

    if (tips.length === 0) {
      return [
        `Research ${role} job requirements`,
        `Build ${role} portfolio`,
        `Practice interview questions`,
        `Network with professionals`,
        `Prepare strong resume`
      ];
    }

    return tips;

  } catch (error) {
    return [
      `Research ${role} job requirements`,
      `Build ${role} portfolio`,
      `Practice interview questions`,
      `Network with professionals`,
      `Prepare strong resume`
    ];
  }
}


// ================= API ROUTES =================

// Roadmap API
app.post('/roadmap', async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill) {
      return res.status(400).json({ error: 'Skill required' });
    }

    const roadmap = await generateRoadmap(skill);

    res.json({ skill, roadmap });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Job tips API
app.post('/job', async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role required' });
    }

    const preparationTips = await generateJobTips(role);

    res.json({ role, preparationTips });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server running'
  });
});


// ================= FRONTEND FALLBACK =================

// ✅ Important for deployment (fixes blank page issues)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});