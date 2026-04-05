require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require("path");
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// ================= GEMINI FUNCTIONS =================

async function generateRoadmap(skill) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(`Generate roadmap for ${skill}`);
    return result.response.text().split('\n').slice(0, 6);
  } catch {
    return [
      `Learn basics of ${skill}`,
      `Practice ${skill}`,
      `Build projects`,
      `Study advanced topics`,
      `Join communities`,
      `Stay updated`
    ];
  }
}

async function generateJobTips(role) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(`Give tips for ${role}`);
    return result.response.text().split('\n').slice(0, 5);
  } catch {
    return [
      "Build portfolio",
      "Practice interviews",
      "Improve resume",
      "Network",
      "Apply regularly"
    ];
  }
}


// ================= API ROUTES =================

app.post('/roadmap', async (req, res) => {
  const { skill } = req.body;
  if (!skill) return res.status(400).json({ error: 'Skill required' });

  const roadmap = await generateRoadmap(skill);
  res.json({ skill, roadmap });
});

app.post('/job', async (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: 'Role required' });

  const preparationTips = await generateJobTips(role);
  res.json({ role, preparationTips });
});


// ================= REAL-TIME JOB FETCH =================

async function fetchRealTimeJobData(userQuery) {
  try {
    let searchTerm = userQuery.toLowerCase();

    // 🔥 SMART MAPPING
    if (searchTerm.includes("data")) searchTerm = "data scientist";
    else if (searchTerm.includes("web")) searchTerm = "web developer";
    else if (searchTerm.includes("react")) searchTerm = "react developer";
    else if (searchTerm.includes("python")) searchTerm = "python developer";
    else if (searchTerm.includes("frontend")) searchTerm = "frontend developer";
    else if (searchTerm.includes("backend")) searchTerm = "backend developer";
    else if (searchTerm.includes("fullstack")) searchTerm = "full stack developer";
    else if (searchTerm.includes("java")) searchTerm = "java developer";
    else if (searchTerm.includes("node")) searchTerm = "node developer";

    console.log("FINAL SEARCH TERM:", searchTerm);

    // 🔹 MAIN API CALL
    let apiUrl = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(searchTerm)}`;
    let response = await fetch(apiUrl);
    let data = await response.json();

    let jobs = data.jobs || [];

    // 🔥 FALLBACK FIX (IMPORTANT)
    if (jobs.length === 0) {
      console.log("No jobs found, trying fallback...");

      const fallbackUrl = `https://remotive.com/api/remote-jobs?search=developer`;
      const fallbackRes = await fetch(fallbackUrl);
      const fallbackData = await fallbackRes.json();

      jobs = fallbackData.jobs || [];
    }

    // Still empty safety
    if (jobs.length === 0) {
      return [];
    }

    return jobs.slice(0, 3).map(job => ({
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location,
      url: job.url
    }));

  } catch (err) {
    console.error("Job fetch error:", err.message);
    return [];
  }
}


// ================= CHAT API =================

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const jobs = await fetchRealTimeJobData(message);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    let aiResponse;

    try {
      const result = await model.generateContent(
        `User asked: ${message}. Here are jobs: ${JSON.stringify(jobs)}`
      );
      aiResponse = result.response.text();
    } catch (err) {
      console.error("Gemini failed:", err.message);
      aiResponse = `Found ${jobs.length} jobs. Top roles include: ${
  jobs.map(j => j.title).join(", ")
}`;
    }

    res.json({
      message,
      response: aiResponse,
      jobs
    });

  } catch (error) {
    console.error('Chat API Error:', error);

    res.json({
      message: req.body.message,
      response: "Something went wrong.",
      jobs: []
    });
  }
});


// ================= HEALTH =================

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});


// ================= FALLBACK =================

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// ================= START =================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});