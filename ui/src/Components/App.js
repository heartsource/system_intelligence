import React, { useEffect, useContext } from "react";
import ConfigFileUpload from "../Components/ConfigUser/ConfigFileUpload";
import Home from "./Home";
import ConfigAskHearty from "../Components/ConfigUser/ConfigAskHearty";
import ConfigNavbar from "../Components/ConfigUser/ConfigNavbar";
import ConfigAgents from "./ConfigUser/ConfigAgents";
import ConfigAgentDetails from "./ConfigUser/ConfigAgentDetails";
import ConfigAgentLogs from "./ConfigUser/ConfigAgentLogs";
import ConfigKnowledgeEnrichmentDetails from "./ConfigUser/ConfigKnowledgeEnrichmentDetails";
import ConfigKnowledgeEnrichment from "./ConfigUser/ConfigKnowledgeEnrichment";
import Footer from "./Footer";

import ConfigAgentLogDetails from "./ConfigUser/ConfigAgentLogDetails";

import { AppProvider, AppContext } from "../context/AppContext";

const App = () => {
  const { currentComponent } = useContext(AppContext);

  const handleTextSubmit = (text) => {
    console.log("Text submitted:", text);
    // any further actions here, such as making an API call, updating state, etc.
  };

  const renderComponent = () => {
    switch (currentComponent) {
      case "home":
        return <Home />;
      case "agents":
        return <ConfigAgents />;
      case "agentDetails":
        return <ConfigAgentDetails />;
      case "agentLogs":
        return <ConfigAgentLogs />;
      case "upload":
        return <ConfigFileUpload />;
      case "config-ask-hearty":
        return <ConfigAskHearty onTextSubmit={handleTextSubmit} />;
      case "config-knowledge-enrichment":
        return <ConfigKnowledgeEnrichment />;
      case "agent-log-details":
        return <ConfigAgentLogDetails />;
      case "knowledge-details":
        return <ConfigKnowledgeEnrichmentDetails />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <ConfigNavbar />
      <div className="container">{renderComponent()}</div>
      <Footer />
    </>
  );
};

const AppWrapper = () => {
  <AppProvider>
    <App />
  </AppProvider>;
};

export default App;
