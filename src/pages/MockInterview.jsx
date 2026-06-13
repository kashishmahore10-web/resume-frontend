import { useState, useEffect, useRef } from "react";
import { getInterviewQuestions, evaluateAnswer } from "../services/api";

const MockInterview = () => {
  const [step, setStep] = useState("setup");
  const [mode, setMode] = useState(null); // "simple" | "full"
  const [setup, setSetup] = useState({ targetRole: "", experienceLevel: "Fresher", numQuestions: 5 });
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timer, setTimer] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [aiStatus, setAiStatus] = useState("Ready");
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { console.log("Camera not available"); }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject)
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
  };

  const speakText = (text, onEnd) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9; u.pitch = 1;
    u.onstart = () => { setIsSpeaking(true); setAiStatus("Speaking..."); };
    u.onend = () => { setIsSpeaking(false); setAiStatus("Listening..."); if (onEnd) onEnd(); };
    window.speechSynthesis.speak(u);
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError("Use Chrome for voice support"); return; }
    const r = new SR();
    r.continuous = true; r.interimResults = true; r.lang = "en-US";
    r.onstart = () => { setIsListening(true); setAiStatus("Listening..."); };
    r.onend = () => setIsListening(false);
    r.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setAnswers(prev => ({ ...prev, [currentQ]: t }));
    };
    r.onerror = (e) => { setIsListening(false); };
    recognitionRef.current = r;
    r.start();
  };

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };

  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) { setAiStatus("Time's up!"); stopListening(); }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timer]);

  useEffect(() => {
    if (step === "interview" && questions.length > 0) {
      setTimer(120); setTimerActive(false); setAiStatus("Preparing...");
      setTimeout(() => {
        if (mode === "full") {
          speakText(questions[currentQ].question, () => { startListening(); setTimerActive(true); });
        } else {
          setAiStatus("Answer below"); setTimerActive(true);
        }
      }, 500);
    }
    return () => { window.speechSynthesis.cancel(); stopListening(); };
  }, [currentQ, step]);

  const startInterview = async () => {
    if (!setup.targetRole) { setError("Please enter a target role!"); return; }
    if (!mode) { setError("Please select an interview mode!"); return; }
    setLoading(true); setError("");
    try {
      const result = await getInterviewQuestions(setup.targetRole, setup.experienceLevel, setup.numQuestions);
      if (result.success) {
        setQuestions(result.data.questions);
        if (mode === "full") await startCamera();
        setStep("interview"); setCurrentQ(0);
      } else setError("Failed to generate questions.");
    } catch { setError("Failed to connect to AI. Is Colab running?"); }
    setLoading(false);
  };

  const submitAnswer = async () => {
    const answer = answers[currentQ] || "";
    if (!answer.trim()) { setError("Please give an answer!"); return; }
    stopListening(); window.speechSynthesis.cancel(); setTimerActive(false);
    setLoading(true); setError(""); setAiStatus("Evaluating...");
    try {
      const result = await evaluateAnswer(questions[currentQ].question, answer, setup.targetRole);
      if (result.success) {
        setEvaluations(prev => ({ ...prev, [currentQ]: result.data }));
        if (currentQ + 1 < questions.length) {
          setCurrentQ(currentQ + 1);
        } else {
          stopCamera();
          if (mode === "full") speakText("Interview complete! Great job.");
          setStep("results");
        }
      } else setError("Evaluation failed.");
    } catch { setError("Failed to connect to AI."); }
    setLoading(false);
  };

  const avgScore = () => {
    const s = Object.values(evaluations).map(e => e.score);
    return s.length ? (s.reduce((a, b) => a + b, 0) / s.length).toFixed(1) : 0;
  };

  const timerColor = timer > 60 ? "text-green-400" : timer > 30 ? "text-yellow-400" : "text-red-400";
  const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ─── SETUP ─── */}
      {step === "setup" && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-700">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🎤</div>
              <h1 className="text-3xl font-bold">AI Mock Interview</h1>
              <p className="text-gray-400 mt-2">Choose your interview mode and start practicing</p>
            </div>

            {/* MODE SELECTION */}
            <p className="text-gray-300 font-semibold mb-3">Select Interview Mode</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Simple Mode */}
              <div onClick={() => setMode("simple")}
                className={`cursor-pointer rounded-xl p-5 border-2 transition ${
                  mode === "simple" ? "border-blue-500 bg-blue-900" : "border-gray-600 bg-gray-800 hover:border-gray-400"}`}>
                <div className="text-3xl mb-2">⌨️</div>
                <h3 className="font-bold text-white text-lg">Simple Mode</h3>
                <p className="text-gray-400 text-sm mt-1">Mic + Text + Timer only. Clean and distraction-free.</p>
                <ul className="mt-3 space-y-1">
                  <li className="text-xs text-gray-300">✅ Microphone input</li>
                  <li className="text-xs text-gray-300">✅ Text typing</li>
                  <li className="text-xs text-gray-300">✅ Countdown timer</li>
                  <li className="text-xs text-gray-400">❌ No camera</li>
                  <li className="text-xs text-gray-400">❌ No AI voice</li>
                </ul>
              </div>

              {/* Full Mode */}
              <div onClick={() => setMode("full")}
                className={`cursor-pointer rounded-xl p-5 border-2 transition ${
                  mode === "full" ? "border-purple-500 bg-purple-900" : "border-gray-600 bg-gray-800 hover:border-gray-400"}`}>
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-bold text-white text-lg">Full AI Room</h3>
                <p className="text-gray-400 text-sm mt-1">Complete interview experience with AI interviewer.</p>
                <ul className="mt-3 space-y-1">
                  <li className="text-xs text-gray-300">✅ Microphone input</li>
                  <li className="text-xs text-gray-300">✅ Text typing</li>
                  <li className="text-xs text-gray-300">✅ Countdown timer</li>
                  <li className="text-xs text-gray-300">✅ Live camera</li>
                  <li className="text-xs text-gray-300">✅ AI reads questions aloud</li>
                </ul>
              </div>
            </div>

            {/* FORM */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Target Role</label>
                <input type="text" placeholder="e.g. Python Developer"
                  value={setup.targetRole}
                  onChange={(e) => setSetup({ ...setup, targetRole: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Experience Level</label>
                  <select value={setup.experienceLevel}
                    onChange={(e) => setSetup({ ...setup, experienceLevel: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 text-white p-3 rounded-lg">
                    <option>Fresher</option>
                    <option>Junior (1-2 years)</option>
                    <option>Mid-level (3-5 years)</option>
                    <option>Senior (5+ years)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Questions</label>
                  <select value={setup.numQuestions}
                    onChange={(e) => setSetup({ ...setup, numQuestions: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-600 text-white p-3 rounded-lg">
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={8}>8 Questions</option>
                    <option value={10}>10 Questions</option>
                  </select>
                </div>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

            <button onClick={startInterview} disabled={loading}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-lg disabled:opacity-50 transition ${
                mode === "full" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"}`}>
              {loading ? "⏳ Preparing..." : mode === "full" ? "🤖 Start Full AI Interview" : mode === "simple" ? "⌨️ Start Simple Interview" : "🚀 Start Interview"}
            </button>
          </div>
        </div>
      )}

      {/* ─── SIMPLE MODE INTERVIEW ─── */}
      {step === "interview" && mode === "simple" && questions.length > 0 && (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-2xl border border-gray-700">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-gray-400 text-sm">Question {currentQ+1} of {questions.length}</span>
                <h2 className="text-white font-bold text-lg">{setup.targetRole} Interview</h2>
              </div>
              <div className={`text-4xl font-bold font-mono ${timerColor}`}>{formatTime(timer)}</div>
            </div>

            {/* Progress */}
            <div className="flex gap-2 mb-6">
              {questions.map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${
                  i < currentQ ? "bg-green-500" : i === currentQ ? "bg-blue-500" : "bg-gray-700"}`} />
              ))}
            </div>

            {/* Question */}
            <div className="bg-gray-800 rounded-xl p-5 mb-5 border border-gray-600">
              <div className="flex gap-2 mb-3">
                <span className="text-xs bg-blue-800 text-blue-200 px-2 py-1 rounded">{questions[currentQ].type}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  questions[currentQ].difficulty === "easy" ? "bg-green-800 text-green-200" :
                  questions[currentQ].difficulty === "medium" ? "bg-yellow-800 text-yellow-200" :
                  "bg-red-800 text-red-200"}`}>{questions[currentQ].difficulty}</span>
              </div>
              <p className="text-white text-lg font-medium">{questions[currentQ].question}</p>
            </div>

            {/* Mic Controls */}
            <div className="flex gap-3 mb-3">
              {!isListening ? (
                <button onClick={startListening}
                  className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  🎤 Start Mic
                </button>
              ) : (
                <button onClick={stopListening}
                  className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
                  ⏹ Stop Mic
                </button>
              )}
              {isListening && <span className="text-green-400 text-sm flex items-center animate-pulse">● Recording...</span>}
            </div>

            {/* Answer */}
            <textarea
              placeholder="Speak or type your answer here..."
              value={answers[currentQ] || ""}
              onChange={(e) => setAnswers({ ...answers, [currentQ]: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 text-white p-3 rounded-lg h-36 resize-none focus:outline-none focus:border-blue-500 mb-4" />

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <button onClick={submitAnswer} disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold disabled:opacity-50">
              {loading ? "⏳ Evaluating..." : currentQ+1 === questions.length ? "🏁 Finish" : "➡️ Next Question"}
            </button>
          </div>
        </div>
      )}

      {/* ─── FULL AI ROOM INTERVIEW ─── */}
      {step === "interview" && mode === "full" && questions.length > 0 && (
        <div className="h-screen flex flex-col">
          {/* Top Bar */}
          <div className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">LIVE — {setup.targetRole}</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-gray-400 text-sm">Q {currentQ+1}/{questions.length}</span>
              <span className={`text-2xl font-bold font-mono ${timerColor}`}>{formatTime(timer)}</span>
              <span className={`text-sm px-3 py-1 rounded-full ${
                isSpeaking ? "bg-purple-700 text-purple-200" :
                isListening ? "bg-green-700 text-green-200" : "bg-gray-700 text-gray-300"}`}>
                {aiStatus}
              </span>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left */}
            <div className="flex-1 flex flex-col p-6 gap-4">
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                  isSpeaking ? "bg-purple-600 animate-pulse" : "bg-blue-600"}`}>🤖</div>
                <div>
                  <p className="font-semibold">AI Interviewer</p>
                  <p className="text-gray-400 text-sm">{setup.targetRole} • {setup.experienceLevel}</p>
                  {isSpeaking && <p className="text-purple-400 text-xs animate-pulse">● Speaking...</p>}
                  {isListening && <p className="text-green-400 text-xs animate-pulse">● Listening...</p>}
                </div>
                <button onClick={() => speakText(questions[currentQ].question)}
                  className="ml-auto bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm">
                  🔊 Repeat
                </button>
              </div>

              <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 flex-1">
                <div className="flex gap-2 mb-3">
                  <span className="text-xs bg-blue-800 text-blue-200 px-2 py-1 rounded">{questions[currentQ].type}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    questions[currentQ].difficulty === "easy" ? "bg-green-800 text-green-200" :
                    questions[currentQ].difficulty === "medium" ? "bg-yellow-800 text-yellow-200" :
                    "bg-red-800 text-red-200"}`}>{questions[currentQ].difficulty}</span>
                </div>
                <p className="text-white text-xl font-medium leading-relaxed">{questions[currentQ].question}</p>
                <div className="flex gap-2 mt-6">
                  {questions.map((_, i) => (
                    <div key={i} className={`h-2 flex-1 rounded-full ${
                      i < currentQ ? "bg-green-500" : i === currentQ ? "bg-blue-500" : "bg-gray-700"}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="w-96 flex flex-col p-6 gap-4 border-l border-gray-700">
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 relative">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-48 object-cover bg-gray-800" />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-xs px-2 py-1 rounded">You</div>
                {isListening && (
                  <div className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded-full animate-pulse">● REC</div>
                )}
              </div>

              <div className="flex gap-2">
                {!isListening ? (
                  <button onClick={startListening}
                    className="flex-1 bg-green-700 hover:bg-green-600 py-2 rounded-lg text-sm font-medium">
                    🎤 Start Mic
                  </button>
                ) : (
                  <button onClick={stopListening}
                    className="flex-1 bg-red-700 hover:bg-red-600 py-2 rounded-lg text-sm font-medium animate-pulse">
                    ⏹ Stop Mic
                  </button>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-gray-400 text-sm mb-2">Your Answer</label>
                <textarea
                  placeholder="Speak or type your answer..."
                  value={answers[currentQ] || ""}
                  onChange={(e) => setAnswers({ ...answers, [currentQ]: e.target.value })}
                  className="flex-1 bg-gray-800 border border-gray-600 text-white p-3 rounded-lg resize-none focus:outline-none focus:border-blue-500 text-sm" />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button onClick={submitAnswer} disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold disabled:opacity-50">
                {loading ? "⏳ Evaluating..." : currentQ+1 === questions.length ? "🏁 Finish Interview" : "➡️ Next Question"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── RESULTS ─── */}
      {step === "results" && (
        <div className="min-h-screen p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-8 mb-6 text-center border border-gray-700">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold">Interview Complete!</h1>
              <div className={`text-7xl font-bold my-6 ${
                avgScore() >= 7 ? "text-green-400" : avgScore() >= 5 ? "text-yellow-400" : "text-red-400"}`}>
                {avgScore()}<span className="text-3xl text-gray-400">/10</span>
              </div>
              <p className="text-gray-400">Overall Performance</p>
              <button onClick={() => { setStep("setup"); setMode(null); setQuestions([]); setAnswers({}); setEvaluations({}); }}
                className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold">
                🔄 Try Again
              </button>
            </div>

            {questions.map((q, i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-6 mb-4 border border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-medium flex-1 pr-4">Q{i+1}: {q.question}</p>
                  <span className={`text-3xl font-bold shrink-0 ${
                    evaluations[i]?.score >= 7 ? "text-green-400" :
                    evaluations[i]?.score >= 5 ? "text-yellow-400" : "text-red-400"}`}>
                    {evaluations[i]?.score}/10
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-4">{evaluations[i]?.feedback}</p>
                <div className="grid grid-cols-2 gap-4">
                  {evaluations[i]?.strengths?.length > 0 && (
                    <div>
                      <p className="text-green-400 text-xs font-semibold mb-1">💪 Strengths</p>
                      {evaluations[i].strengths.map((s, j) => <p key={j} className="text-gray-400 text-xs">• {s}</p>)}
                    </div>
                  )}
                  {evaluations[i]?.improvements?.length > 0 && (
                    <div>
                      <p className="text-red-400 text-xs font-semibold mb-1">📈 Improvements</p>
                      {evaluations[i].improvements.map((s, j) => <p key={j} className="text-gray-400 text-xs">• {s}</p>)}
                    </div>
                  )}
                </div>
                {evaluations[i]?.sampleAnswer && (
                  <div className="bg-gray-800 rounded-lg p-3 mt-3">
                    <p className="text-blue-400 text-xs font-semibold mb-1">💡 Sample Answer</p>
                    <p className="text-gray-300 text-xs">{evaluations[i].sampleAnswer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;