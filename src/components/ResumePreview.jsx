import { useContext, useState } from "react";

import { ResumeContext }
from "../context/ResumeContext";

import TemplateOne
from "./templates/TemplateOne";

import TemplateTwo
from "./templates/TemplateTwo";

const ResumePreview = () => {

  const { resumeData } =
    useContext(ResumeContext);

  const [selectedTemplate,
    setSelectedTemplate] =
    useState(1);

  return (
    <div 
    id="resume-preview"
    className="p-6 bg-gray-100 min-h-screen">

      {/* TEMPLATE SWITCH BUTTONS */}

      <div className="flex gap-4 mb-6">

        <button
          onClick={() =>
            setSelectedTemplate(1)
          }
          className="bg-black text-white px-4 py-2 rounded"
        >
          Template 1
        </button>

        <button
          onClick={() =>
            setSelectedTemplate(2)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Template 2
        </button>

      </div>

      {/* TEMPLATE RENDERING */}

      {
        selectedTemplate === 1
          ? (
              <TemplateOne
                data={resumeData}
              />
            )
          : (
              <TemplateTwo
                data={resumeData}
              />
            )
      }

    </div>
  );
};

export default ResumePreview;