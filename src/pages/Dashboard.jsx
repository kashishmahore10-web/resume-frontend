import Navbar from "../components/NavBar";

const Dashboard = () => {
  return (
    <div>

      <Navbar />

      <div className="p-10">

        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

        <button className="bg-black text-white px-6 py-3 rounded">

          Create Resume

        </button>

      </div>

    </div>
  );
};

export default Dashboard;