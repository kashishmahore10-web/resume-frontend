import { useContext, useState } from "react";
import { ResumeContext } from "../context/ResumeContext";
import { getATSScore, getImprovementSuggestions } from "../services/api";

const ATSScore = () => {
  const { resumeData } = useContext(ResumeContext);
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Build resume text from context
  const buildResumeText = () => {
    return `
      ${resumeData.name} ${resumeData.email} ${resumeData.phone}
      ${resumeData.summary}
      Skills: ${resumeData.skills.join(", ")}
      Experience: ${resumeData.experiences.map(e => `${e.role} at ${e.company} ${e.duration} ${e.description}`).join(" ")}
      Projects: ${resumeData.projects.map(p => `${p.title} ${p.tech} ${p.description}`).join(" ")}
      Education: ${resumeData.education} ${resumeData.college} ${resumeData.cgpa}
    `;
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const resumeText = buildResumeText();
      const [atsResult, suggestResult] = await Promise.all([
        getATSScore(resumeText, jobDescription),
        getImprovementSuggestions(resumeText, jobDescription)
      ]);
      setScore(atsResult);
      setSuggestions(suggestResult.data);
    } catch (err) {
      setError("Failed to connect to AI. Is Colab running?");
    }
    setLoading(false);
  };

  const getScoreColor = (s) => {
    if (s >= 75) return "text-green-600";
    if (s >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="bg-white shadow p-5 rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">🤖 AI ATS Score</h2>

      {/* Job Description Input */}
      <textarea
        className="w-full border rounded p-3 text-sm mb-3 h-28"
        placeholder="Paste the job description here to get your AI ATS score..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded w-full font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "⏳ Analyzing..." : "Analyze with AI"}
      </button>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      {/* Score Results */}
      {score && (
        <div className="mt-5">
          <div className={`text-5xl font-bold ${getScoreColor(score.atsScore)}`}>
            {score.atsScore}%
          </div>
          <p className="text-gray-500 text-sm mt-1">Overall ATS Score</p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-xs text-gray-500">Semantic Match</p>
              <p className="text-xl font-bold text-blue-600">{score.semanticMatchScore}%</p>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <p className="text-xs text-gray-500">Keyword Match</p>
              <p className="text-xl font-bold text-purple-600">{score.keywordMatchScore}%</p>
            </div>
          </div>

          {/* Matched Keywords */}
          {score.matchedKeywords?.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-green-600 text-sm">✅ Matched Keywords</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {score.matchedKeywords.map((k, i) => (
                  <span key={i} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{k}</span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {score.missingKeywords?.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-red-500 text-sm">❌ Missing Keywords</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {score.missingKeywords.map((k, i) => (
                  <span key={i} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">{k}</span>
                ))}
              </div>
            </div>
          )}

          {/* Formatting Issues */}
          {score.formattingIssues?.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-yellow-600 text-sm">⚠️ Formatting Issues</p>
              <ul className="list-disc list-inside mt-1">
                {score.formattingIssues.map((issue, i) => (
                  <li key={i} className="text-xs text-gray-600">{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* AI Suggestions */}
      {suggestions && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-bold text-lg mb-2">💡 AI Suggestions</h3>
          <p className="text-sm text-gray-600 mb-3">{suggestions.overallFeedback}</p>

          {suggestions.strengths?.length > 0 && (
            <div className="mb-3">
              <p className="font-semibold text-green-600 text-sm">💪 Strengths</p>
              <ul className="list-disc list-inside mt-1">
                {suggestions.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-gray-600">{s}</li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.weaknesses?.length > 0 && (
            <div className="mb-3">
              <p className="font-semibold text-red-500 text-sm">⚠️ Weaknesses</p>
              <ul className="list-disc list-inside mt-1">
                {suggestions.weaknesses.map((w, i) => (
                  <li key={i} className="text-xs text-gray-600">{w}</li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.atsCompatibilityTips?.length > 0 && (
            <div className="mb-3">
              <p className="font-semibold text-blue-600 text-sm">🎯 ATS Tips</p>
              <ul className="list-disc list-inside mt-1">
                {suggestions.atsCompatibilityTips.map((t, i) => (
                  <li key={i} className="text-xs text-gray-600">{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ATSScore;