import { useState } from "react";

import Sidebar
from "../components/Sidebar";

import ResumeForm
from "../components/ResumeForm";

import ResumePreview
from "../components/ResumePreview";

import DownloadButton
from "../components/DownloadButton";

import ATSScore
from "../components/ATSScore";

const Builder = () => {

  const [darkMode,
    setDarkMode] =
    useState(false);

  return (

    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-white text-black"
      }`}
    >

      {/* TOP BAR */}

      <div className="flex justify-between items-center p-4 border-b">

        <h1 className="text-2xl font-bold">
          AI Resume Builder
        </h1>

        <div className="flex gap-4">

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="bg-black text-white px-4 py-2 rounded"
          >
            Toggle Theme
          </button>

          <DownloadButton />

        </div>

      </div>

      {/* MAIN LAYOUT */}

      <div className="grid grid-cols-1 lg:grid-cols-12">

        {/* SIDEBAR */}

        <div className="lg:col-span-2 border-r">

          <Sidebar />

        </div>

        {/* FORM SECTION */}

        <div className="lg:col-span-5 h-screen overflow-y-scroll border-r p-6">

          <ResumeForm />

        </div>

        {/* PREVIEW SECTION */}

        <div className="lg:col-span-5 h-screen overflow-y-scroll bg-gray-100 p-6">

          <ATSScore />

          <ResumePreview />

        </div>

      </div>

    </div>
  );
};

export default Builder;