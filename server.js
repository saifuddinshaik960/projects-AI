require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
  res.send("Server working");
});

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
    
    // Parse and clean the response
    const steps = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && /^\d+/.test(line)) // Only keep lines starting with numbers
      .map(line => {
        // Remove numbering and clean up the text
        return line
          .replace(/^\d+\.\s*/, '') // Remove "1. ", "2. ", etc.
          .replace(/^\d+\)\s*/, '') // Remove "1) ", "2) ", etc.
          .replace(/^\d+\.\s*/, '') // Remove any remaining numbered format
          .replace(/^-\s*/, '') // Remove bullet points if any
          .replace(/^\*\s*/, '') // Remove asterisks if any
          .replace(/\[.*?\]/g, '') // Remove brackets and content
          .replace(/[""''']/g, '') // Remove quotes
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim();
      })
      .filter(step => step.length > 0) // Remove empty steps
      .slice(0, 6); // Ensure we get exactly 6 steps
    
    // If we don't get enough steps, provide fallback
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
    // Return fallback steps on error
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

// Generate job preparation tips using Gemini
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
- Focus on actionable advice
- Use bullet point style
- No explanations or extra text
- Only return the numbered list
- Cover skills, interview, portfolio, networking

Role: ${role}`;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse and clean the response
    const tips = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && /^\d+/.test(line)) // Only keep lines starting with numbers
      .map(line => {
        // Remove numbering and clean up the text
        return line
          .replace(/^\d+\.\s*/, '') // Remove "1. ", "2. ", etc.
          .replace(/^\d+\)\s*/, '') // Remove "1) ", "2) ", etc.
          .replace(/^\d+\.\s*/, '') // Remove any remaining numbered format
          .replace(/^-\s*/, '') // Remove bullet points if any
          .replace(/^\*\s*/, '') // Remove asterisks if any
          .replace(/\[.*?\]/g, '') // Remove brackets and content
          .replace(/[""''']/g, '') // Remove quotes
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim();
      })
      .filter(tip => tip.length > 0) // Remove empty tips
      .slice(0, 5); // Ensure we get exactly 5 tips
    
    // If we don't get enough tips, provide fallback
    if (tips.length === 0) {
      return [
        `Research ${role} job requirements thoroughly`,
        `Build relevant ${role} skills and portfolio`,
        `Practice ${role} interview questions`,
        `Network with ${role} professionals`,
        `Prepare your resume for ${role} positions`
      ];
    }

    return tips;
  } catch (error) {
    // Return fallback tips on error
    return [
      `Research ${role} job requirements thoroughly`,
      `Build relevant ${role} skills and portfolio`,
      `Practice ${role} interview questions`,
      `Network with ${role} professionals`,
      `Prepare your resume for ${role} positions`
    ];
  }
}

// POST /roadmap endpoint
app.post('/roadmap', async (req, res) => {
  try {
    const { skill } = req.body;
    
    if (!skill || typeof skill !== 'string' || skill.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Skill parameter is required' 
      });
    }
    
    // Generate roadmap using Gemini
    const roadmap = await generateRoadmap(skill.trim());
    
    res.json({
      skill: skill.trim(),
      roadmap: roadmap
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Something went wrong' 
    });
  }
});

// POST /job endpoint
app.post('/job', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || typeof role !== 'string' || role.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Role parameter is required' 
      });
    }
    
    // Generate job preparation tips using Gemini
    const prepTips = await generateJobTips(role.trim());
    
    res.json({
      role: role.trim(),
      preparationTips: prepTips
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Something went wrong' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CareerBoost API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`CareerBoost API server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Global error handler
app.use((error, req, res, next) => {
  res.status(500).json({ 
    error: 'Something went wrong' 
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found' 
  });
});
