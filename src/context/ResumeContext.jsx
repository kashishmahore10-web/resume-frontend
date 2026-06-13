import { createContext, useState } from "react";
import { useEffect } from "react";

export const ResumeContext = createContext();

const ResumeProvider = ({ children }) => {

  const [resumeData, setResumeData] = useState(() => {

  const savedData =
    localStorage.getItem(
      "resumeData"
    );

  return savedData
    ? JSON.parse(savedData)
    : {
        name: "",
        profileImage: "",
        email: "",
        phone: "",
        summary: "",
        education: "",
        college: "",
        cgpa: "",

        skills: [],
        skillInput: "",

        experiences: [
          {
            company: "",
            role: "",
            duration: "",
            description: ""
          }
        ],

        projects: [
          {
            title: "",
            tech: "",
            description: ""
          }
        ]
      };
});

  useEffect(() => {

  localStorage.setItem(
    "resumeData",
    JSON.stringify(resumeData)
  );

}, [resumeData]);

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export default ResumeProvider;