import React, { useState } from "react";
import ConfigFileUpload from "../Components/ConfigUser/ConfigFileUpload";
import Home from "./Home";
import ConfigAskHearty from "../Components/ConfigUser/ConfigAskHearty";
import ConfigNavbar from "../Components/ConfigUser/ConfigNavbar";
import ConfigAgents from "./ConfigUser/ConfigAgents";
import ConfigAgentLogs from "./ConfigUser/ConfigAgentLogs";
import ConfigKnowledgeEnhancement from "./ConfigUser/ConfigKnowledgeEnhancement";

import Footer from "./Footer";

const App = () => {
  const [currentComponent, setCurrentComponent] = useState("home");

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
      case "agentLogs":
        return <ConfigAgentLogs />;
      case "upload":
        return <ConfigFileUpload />;
      case "config-ask-hearty":
        return <ConfigAskHearty onTextSubmit={handleTextSubmit} />;
      case "config-knowledge-enhancement":
        return <ConfigKnowledgeEnhancement />;
      default:
        return <Home />;
    }
  };

  return (
    <div>
      <ConfigNavbar setCurrentComponent={setCurrentComponent} />

      <div className="container">{renderComponent()}</div>

      <Footer />
    </div>
  );
};

export default App;
