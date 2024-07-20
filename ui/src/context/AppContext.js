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
  const [sortConfig, setSortConfig] = useState({
    key: "interaction_id",
    direction: "desc",
  });

  // This will create a unique key that changes even if the component value stays the same
  const [componentKey, setComponentKey] = useState(0);

  useEffect(() => {
    localStorage.setItem("currentComponent", currentComponent);
  }, [currentComponent]);

  const updateCurrentComponent = (component) => {
    setCurrentComponent(component);
    setComponentKey((prevKey) => prevKey + 1); // Update the key to force re-render
  };

  return (
    <AppContext.Provider
      value={{
        currentComponent,
        setCurrentComponent: updateCurrentComponent, // Use the new update function
        selectedAgent,
        setSelectedAgent,
        logs,
        setLogs,
        selectedAgentId,
        setSelectedAgentId,
        filteredLogs,
        setFilteredLogs,
        sortConfig,
        setSortConfig,
        componentKey, // Provide the componentKey
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
