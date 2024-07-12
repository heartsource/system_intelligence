import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentComponent, setCurrentComponent] = useState("home");
  const [selectedAgent, setSelectedAgent] = useState(null);

  return (
    <AppContext.Provider
      value={{
        currentComponent,
        setCurrentComponent,
        selectedAgent,
        setSelectedAgent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
