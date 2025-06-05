import { createContext, useContext, useState } from "react";

const ResumeContext = createContext();

export const useResume = () => useContext(ResumeContext);

export const ResumeProvider = ({ children }) => {
  const [parsedText, setParsedText] = useState(localStorage.getItem("parsedText") || "");
  const [parsedExperience, setParsedExperience] = useState(localStorage.getItem("parsedExperience") || "");
  const [parsedSkills, setParsedSkills] = useState(localStorage.getItem("parsedSkills") || "");

  return (
    <ResumeContext.Provider value={{
      parsedText,
      setParsedText,
      parsedExperience,
      setParsedExperience,
      parsedSkills,
      setParsedSkills
    }}>
      {children}
    </ResumeContext.Provider>
  );
};
