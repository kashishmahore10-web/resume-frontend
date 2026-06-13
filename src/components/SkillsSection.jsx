import { useContext } from "react";

import { ResumeContext }
from "../context/ResumeContext";

const SkillsSection = () => {

  const { resumeData, setResumeData } =
    useContext(ResumeContext);

  const addSkill = () => {

    if (
      resumeData.skillInput.trim()
    ) {

      setResumeData({
        ...resumeData,

        skills: [
          ...resumeData.skills,
          resumeData.skillInput
        ],

        skillInput: ""
      });

    }

  };

  const removeSkill = (index) => {

    const updatedSkills =
      [...resumeData.skills];

    updatedSkills.splice(index, 1);

    setResumeData({
      ...resumeData,
      skills: updatedSkills
    });

  };

  return (
    <div className="mt-10">

      <h2 className="text-3xl font-bold mb-6">
        Skills
      </h2>

      <div className="flex gap-3 mb-5">

        <input
          type="text"
          placeholder="Add Skill"
          value={resumeData.skillInput}
          onChange={(e) =>
            setResumeData({
              ...resumeData,
              skillInput: e.target.value
            })
          }
          className="border p-3 rounded w-full"
        />

        <button
          onClick={addSkill}
          className="bg-black text-white px-5 rounded"
        >
          Add
        </button>

      </div>

      <div className="flex flex-wrap gap-3">

        {
          resumeData.skills.map(
            (skill, index) => (

              <div
                key={index}
                className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2"
              >

                <span>{skill}</span>

                <button
                  onClick={() =>
                    removeSkill(index)
                  }
                >
                  ×
                </button>

              </div>
            )
          )
        }

      </div>

    </div>
  );
};

export default SkillsSection;