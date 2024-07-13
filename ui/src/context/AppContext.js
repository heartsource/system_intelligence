import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentComponent, setCurrentComponent] = useState("home");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  return (
    <AppContext.Provider
      value={{
        currentComponent,
        setCurrentComponent,
        selectedAgent,
        setSelectedAgent,
        logs,
        setLogs,
        selectedAgentId,
        setSelectedAgentId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
