import React, { createContext, useState, useEffect } from "react";
export const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [currentComponent, setCurrentComponent] = useState(() => {
    return localStorage.getItem("currentComponent") || "home";
  });
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    localStorage.setItem("currentComponent", currentComponent);
  }, [currentComponent]);
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
        filteredLogs,
        setFilteredLogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
