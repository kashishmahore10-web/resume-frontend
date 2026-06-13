import { useContext } from "react";
import { ResumeContext } from "../context/ResumeContext";

const ExperienceSection = () => {

  const { resumeData, setResumeData } =
    useContext(ResumeContext);

  const handleExperienceChange = (
    index,
    event
  ) => {

    const values =
      [...resumeData.experiences];

    values[index][event.target.name] =
      event.target.value;

    setResumeData({
      ...resumeData,
      experiences: values
    });
  };

  const addExperience = () => {

    setResumeData({
      ...resumeData,
      experiences: [
        ...resumeData.experiences,
        {
          company: "",
          role: "",
          duration: "",
          description: ""
        }
      ]
    });

  };

  const removeExperience = (index) => {

    const values =
      [...resumeData.experiences];

    values.splice(index, 1);

    setResumeData({
      ...resumeData,
      experiences: values
    });

  };

  return (
    <div className="mt-10">

      <h2 className="text-3xl font-bold mb-6">
        Experience
      </h2>

      {resumeData.experiences.map(
        (experience, index) => (

          <div
            key={index}
            className="border p-5 rounded-lg mb-6"
          >

            <input
              type="text"
              name="company"
              placeholder="Company"
              value={experience.company}
              onChange={(event) =>
                handleExperienceChange(
                  index,
                  event
                )
              }
              className="w-full border p-3 mb-4 rounded"
            />

            <input
              type="text"
              name="role"
              placeholder="Role"
              value={experience.role}
              onChange={(event) =>
                handleExperienceChange(
                  index,
                  event
                )
              }
              className="w-full border p-3 mb-4 rounded"
            />

            <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={experience.duration}
              onChange={(event) =>
                handleExperienceChange(
                  index,
                  event
                )
              }
              className="w-full border p-3 mb-4 rounded"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={experience.description}
              onChange={(event) =>
                handleExperienceChange(
                  index,
                  event
                )
              }
              className="w-full border p-3 mb-4 rounded h-28"
            />

            <button
              onClick={() =>
                removeExperience(index)
              }
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Remove
            </button>

          </div>
        )
      )}

      <button
        onClick={addExperience}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Add Experience
      </button>

    </div>
  );
};

export default ExperienceSection;