import Navbar from "../components/Navbar";

const Login = () => {
  return (
    <div>

      <Navbar />

      <div className="flex justify-center items-center h-[90vh]">

        <div className="w-[400px] shadow-lg p-8 rounded-xl">

          <h2 className="text-3xl font-bold mb-6 text-center">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 mb-4 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 mb-4 rounded"
          />

          <button className="w-full bg-black text-white py-3 rounded">
            Login
          </button>

        </div>

      </div>

    </div>
  );
};

export default Login;