import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && password) {
      localStorage.setItem("user", JSON.stringify({ email }));
      navigate("/dashboard");
    } else {
      alert("Please enter email and password!");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center h-[90vh]">
        <div className="w-[400px] shadow-lg p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 mb-4 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 mb-4 rounded"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-3 rounded"
          >
            Login
          </button>
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-500 cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;