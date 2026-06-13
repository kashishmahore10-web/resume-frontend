import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-black text-white px-8 py-4 flex justify-between">

      <h1 className="text-2xl font-bold">
        SmartResume AI
      </h1>

      <div className="flex gap-6">

        <Link to="/">Home</Link>

        <Link to="/login">Login</Link>

        <Link to="/register">Register</Link>

      </div>
    </div>
  );
};

export default Navbar;