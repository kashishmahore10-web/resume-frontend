import { useContext, useState } from "react";
import { ResumeContext } from "../context/ResumeContext";
import ExperienceSection from "./ExperienceSection";
import ProjectSection from "./ProjectSection";
import SkillsSection from "./SkillsSection";
import { generateResume } from "../services/api";

const ResumeForm = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);
  const [errors, setErrors] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiInput, setAiInput] = useState({
    targetRole: "",
    experience: "",
    skills: "",
  });

  const handleChange = (e) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!resumeData.name.trim()) newErrors.name = "Name is required";
    if (!resumeData.email.includes("@")) newErrors.email = "Valid email required";
    if (resumeData.phone.length < 10) newErrors.phone = "Phone number invalid";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAiGenerate = async () => {
    if (!resumeData.name || !aiInput.targetRole) {
      setAiError("Please fill your Name and Target Role first!");
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const result = await generateResume({
        name: resumeData.name,
        targetRole: aiInput.targetRole,
        experience: aiInput.experience,
        skills: aiInput.skills,
        education: resumeData.education,
      });
      if (result.success) {
        const d = result.data;
        setResumeData({
          ...resumeData,
          summary: d.summary || resumeData.summary,
          skills: d.skills || resumeData.skills,
          experiences: d.experience?.map(e => ({
            company: e.company || "",
            role: e.title || "",
            duration: e.duration || "",
            description: e.bullets?.join(". ") || ""
          })) || resumeData.experiences,
          projects: d.projects?.map(p => ({
            title: p.title || "",
            tech: p.techStack?.join(", ") || "",
            description: p.description || ""
          })) || resumeData.projects,
          education: d.education?.[0]?.degree || resumeData.education,
          college: d.education?.[0]?.institution || resumeData.college,
        });
        setShowAiPanel(false);
      } else {
        setAiError(result.error || "AI generation failed");
      }
    } catch (err) {
      setAiError("Failed to connect to AI. Is Colab running?");
    }
    setAiLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resume Form</h1>
        <button
          onClick={() => setShowAiPanel(!showAiPanel)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700"
        >
          🤖 AI Generate
        </button>
      </div>

      {/* AI GENERATE PANEL */}
      {showAiPanel && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 mb-6">
          <h2 className="text-lg font-bold text-purple-700 mb-3">🤖 AI Resume Generator</h2>
          <p className="text-sm text-gray-500 mb-3">Fill your name below, then provide details for AI to auto-fill your resume.</p>

          <input
            type="text"
            placeholder="Target Role (e.g. Python Developer)"
            value={aiInput.targetRole}
            onChange={(e) => setAiInput({ ...aiInput, targetRole: e.target.value })}
            className="w-full border p-3 mb-3 rounded"
          />
          <textarea
            placeholder="Your Experience (e.g. 2 years Django REST API development)"
            value={aiInput.experience}
            onChange={(e) => setAiInput({ ...aiInput, experience: e.target.value })}
            className="w-full border p-3 mb-3 rounded h-20"
          />
          <textarea
            placeholder="Your Skills (e.g. Python, Django, SQL, Docker, Git)"
            value={aiInput.skills}
            onChange={(e) => setAiInput({ ...aiInput, skills: e.target.value })}
            className="w-full border p-3 mb-3 rounded h-20"
          />

          {aiError && <p className="text-red-500 text-sm mb-2">{aiError}</p>}

          <button
            onClick={handleAiGenerate}
            disabled={aiLoading}
            className="bg-purple-600 text-white px-6 py-2 rounded w-full font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {aiLoading ? "⏳ Generating..." : "✨ Generate Resume with AI"}
          </button>
        </div>
      )}

      {/* NAME */}
      <input type="text" name="name" placeholder="Full Name"
        value={resumeData.name} onChange={handleChange}
        className="w-full border p-3 mb-2 rounded" />
      {errors.name && <p className="text-red-500 mb-4">{errors.name}</p>}

      {/* EMAIL */}
      <input type="email" name="email" placeholder="Email"
        value={resumeData.email} onChange={handleChange}
        className="w-full border p-3 mb-2 rounded" />
      {errors.email && <p className="text-red-500 mb-4">{errors.email}</p>}

      {/* PHONE */}
      <input type="text" name="phone" placeholder="Phone Number"
        value={resumeData.phone} onChange={handleChange}
        className="w-full border p-3 mb-2 rounded" />
      {errors.phone && <p className="text-red-500 mb-4">{errors.phone}</p>}

      {/* SUMMARY */}
      <textarea name="summary" placeholder="Professional Summary"
        value={resumeData.summary} onChange={handleChange}
        className="w-full border p-3 mb-4 rounded h-32" />

      {/* EDUCATION */}
      <input type="text" name="education" placeholder="Degree"
        value={resumeData.education} onChange={handleChange}
        className="w-full border p-3 mb-4 rounded" />
      <input type="text" name="college" placeholder="College Name"
        value={resumeData.college} onChange={handleChange}
        className="w-full border p-3 mb-4 rounded" />
      <input type="text" name="cgpa" placeholder="CGPA"
        value={resumeData.cgpa} onChange={handleChange}
        className="w-full border p-3 mb-4 rounded" />

      {/* PROFILE IMAGE */}
      <h2 className="text-2xl font-bold mb-4 mt-8">Profile Image</h2>
      <input type="file" accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;
          setResumeData({ ...resumeData, profileImage: URL.createObjectURL(file) });
        }}
        className="mb-6 border p-3 w-full rounded" />

      <ExperienceSection />
      <ProjectSection />
      <SkillsSection />

      <button onClick={validateForm}
        className="bg-blue-600 text-white px-6 py-3 rounded mt-8">
        Validate Resume
      </button>
    </div>
  );
};

export default ResumeForm;