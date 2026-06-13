import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="shadow-lg p-6 rounded-xl border">
            <h2 className="text-xl font-bold mb-3">📄 Resume Builder</h2>
            <p className="text-gray-600 mb-4">Create a professional AI-powered resume</p>
            <button
              onClick={() => navigate("/builder")}
              className="w-full bg-black text-white py-3 rounded"
            >
              Create Resume
            </button>
          </div>
          <div className="shadow-lg p-6 rounded-xl border">
            <h2 className="text-xl font-bold mb-3">🎯 Mock Interview</h2>
            <p className="text-gray-600 mb-4">Practice with AI interview questions</p>
            <button
              onClick={() => navigate("/mock-interview")}
              className="w-full bg-black text-white py-3 rounded"
            >
              Start Interview
            </button>
          </div>
          <div className="shadow-lg p-6 rounded-xl border">
            <h2 className="text-xl font-bold mb-3">📊 ATS Score</h2>
            <p className="text-gray-600 mb-4">Check your resume ATS score</p>
            <button
              onClick={() => navigate("/builder")}
              className="w-full bg-black text-white py-3 rounded"
            >
              Check Score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;