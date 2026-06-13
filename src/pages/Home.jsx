import Navbar from "../components/NavBar";

const Home = () => {
  return (
    <div>

      <Navbar />

      <div className="h-[90vh] flex flex-col justify-center items-center">

        <h1 className="text-6xl font-bold mb-6">
          AI Resume Builder
        </h1>

        <p className="text-xl text-gray-600">
          Build ATS-Friendly Professional Resumes
        </p>

      </div>

    </div>
  );
};

export default Home;