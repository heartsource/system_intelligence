import React, { useState, useEffect, useContext } from "react";
import ConfigFileUpload from "../Components/ConfigUser/ConfigFileUpload";
import Home from "./Home";
import ConfigAskHearty from "../Components/ConfigUser/ConfigAskHearty";
import ConfigNavbar from "../Components/ConfigUser/ConfigNavbar";
import ConfigAgents from "./ConfigUser/ConfigAgents";
import ConfigAgentDetails from "./ConfigUser/ConfigAgentDetails";
import ConfigAgentLogs from "./ConfigUser/ConfigAgentLogs";
import ConfigKnowledgeEnhancement from "./ConfigUser/ConfigKnowledgeEnhancement";
import Footer from "./Footer";

import ConfigAgentLogDetails from "./ConfigUser/ConfigAgentLogDetails";

import { AppProvider, AppContext } from "../context/AppContext";

const App = () => {
  const { currentComponent } = useContext(AppContext);
  //const [currentComponent, setCurrentComponent] = useState("home");

  useEffect(() => {
    const body = document.getElementById("body-pd");
    const toggle = document.getElementById("header-toggle");

    if (body && toggle) {
      const toggleHandler = () => {
        body.classList.toggle("body-pd");
      };
      toggle.addEventListener("click", toggleHandler);

      return () => {
        toggle.removeEventListener("click", toggleHandler);
      };
    }
  }, []);

  const handleTextSubmit = (text) => {
    console.log("Text submitted:", text);
    // any further actions here, such as making an API call, updating state, etc.
  };

  const renderComponent = () => {
    switch (currentComponent) {
      case "home":
        return <Home />;
      // return <Home setCurrentComponent={setCurrentComponent} />;
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
      case "config-knowledge-enhancement":
        return <ConfigKnowledgeEnhancement />;
      case "agent-log-details":
        return <ConfigAgentLogDetails />;
      default:
        return <Home />;
      // return <Home setCurrentComponent={setCurrentComponent} />;
    }
  };

  return (
    <div id="body-pd">
      {/* <ConfigNavbar setCurrentComponent={setCurrentComponent} /> */}
      <ConfigNavbar />
      <div className="container">{renderComponent()}</div>
      <Footer />
    </div>
  );
};

const AppWrapper = () => {
  <AppProvider>
    <App />
  </AppProvider>;
};

export default App;
