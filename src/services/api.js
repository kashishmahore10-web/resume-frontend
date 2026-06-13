import axios from "axios";

const BASE_URL = "https://resume-backend-production-3249.up.railway.app";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    
  }
});

// Generate resume using AI
export const generateResume = async (data) => {
  const res = await api.post("/api/ai/generate-resume", data);
  return res.data;
};

// Improve a section using AI
export const improveSection = async (text, type) => {
  const res = await api.post("/api/ai/improve-section", { text, type });
  return res.data;
};

// Get ATS score from AI
export const getATSScore = async (resumeText, jobDescription) => {
  const res = await api.post("/api/ai/ats-score", { resumeText, jobDescription });
  return res.data;
};

// Get improvement suggestions
export const getImprovementSuggestions = async (resumeText, jobDescription) => {
  const res = await api.post("/api/ai/improvement-suggestions", { resumeText, jobDescription });
  return res.data;
};

// Get mock interview questions
export const getInterviewQuestions = async (targetRole, experienceLevel, numQuestions = 5) => {
  const res = await api.post("/api/ai/mock-interview/questions", {
    targetRole, experienceLevel, numQuestions
  });
  return res.data;
};

// Evaluate interview answer
export const evaluateAnswer = async (question, answer, targetRole) => {
  const res = await api.post("/api/ai/mock-interview/evaluate", {
    question, answer, targetRole
  });
  return res.data;
};