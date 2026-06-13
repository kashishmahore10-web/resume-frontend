import { useContext } from "react";

import { ResumeContext }
from "../context/ResumeContext";

const ProjectSection = () => {

  const { resumeData, setResumeData } =
    useContext(ResumeContext);

  const handleProjectChange = (
    index,
    event
  ) => {

    const values =
      [...resumeData.projects];

    values[index][event.target.name] =
      event.target.value;

    setResumeData({
      ...resumeData,
      projects: values
    });

  };

  const addProject = () => {

    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        {
          title: "",
          tech: "",
          description: ""
        }
      ]
    });

  };

  const removeProject = (index) => {

    const values =
      [...resumeData.projects];

    values.splice(index, 1);

    setResumeData({
      ...resumeData,
      projects: values
    });

  };

  return (
    <div className="mt-10">

      <h2 className="text-3xl font-bold mb-6">
        Projects
      </h2>

      {
        resumeData.projects.map(
          (project, index) => (

            <div
              key={index}
              className="border p-5 rounded-lg mb-6"
            >

              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={project.title}
                onChange={(event) =>
                  handleProjectChange(
                    index,
                    event
                  )
                }
                className="w-full border p-3 mb-4 rounded"
              />

              <input
                type="text"
                name="tech"
                placeholder="Technologies Used"
                value={project.tech}
                onChange={(event) =>
                  handleProjectChange(
                    index,
                    event
                  )
                }
                className="w-full border p-3 mb-4 rounded"
              />

              <textarea
                name="description"
                placeholder="Project Description"
                value={project.description}
                onChange={(event) =>
                  handleProjectChange(
                    index,
                    event
                  )
                }
                className="w-full border p-3 mb-4 rounded h-28"
              />

              <button
                onClick={() =>
                  removeProject(index)
                }
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>

            </div>
          )
        )
      }

      <button
        onClick={addProject}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Add Project
      </button>

    </div>
  );
};

export default ProjectSection;