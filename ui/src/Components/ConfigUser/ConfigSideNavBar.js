import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Logo from "../Components/../Images/WhiteLogo-removebg.png";
import "../../Styles/configSideNavBar.css";

const ConfigSideNavBar = () => {
  const { currentComponent, setCurrentComponent, setSelectedAgentId } =
    useContext(AppContext);

  const handleNavigation = (component) => {
    setCurrentComponent(component);
  };

  return (
    <>
      <div class="dashboard">
        <div class="dashboard-nav">
          <header>
            <span>
              <img
                src={Logo}
                height="80px"
                width="100px"
                style={{ backgroundColor: "transparent" }}
              />
            </span>
          </header>
          <nav class="dashboard-nav-list">
            <div
              onClick={() => handleNavigation("home")}
              className={`nav_link ${
                currentComponent === "home" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-gears"></i> Agent <br />
              Configuration
            </div>

            <div
              onClick={() => handleNavigation("agents")}
              className={`nav_link ${
                currentComponent === "agents" ? "active" : ""
              }`}
            >
              <i className="fas fa-users"></i> Agents
            </div>

            <div
              onClick={() => {
                setSelectedAgentId(null);
                handleNavigation("agentLogs");
              }}
              className={`nav_link ${
                currentComponent === "agentLogs" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-headset"></i> Agent Logs
            </div>

            <div
              onClick={() => handleNavigation("upload")}
              className={`nav_link ${
                currentComponent === "upload" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-upload"></i> Knowledge Upload
            </div>

            <div
              onClick={() => handleNavigation("config-ask-hearty")}
              className={`nav_link ${
                currentComponent === "config-ask-hearty" ? "active" : ""
              }`}
            >
              <i className="fa-solid fa-heart"></i> Ask Hearty
            </div>
            <div
              onClick={() => handleNavigation("config-knowledge-enrichment")}
              className={`nav_link ${
                currentComponent === "config-knowledge-enrichment"
                  ? "active"
                  : ""
              }`}
            >
              <i className="fa-solid fa-chart-line"></i> Knowledge
              <br />
              Enrichment
            </div>
            <div class="nav-item-divider"></div>
            <div
              onClick={() => handleNavigation("profile")}
              className="nav_link"
            >
              <i class="fa-solid fa-right-from-bracket"></i> Log Out
            </div>
          </nav>
        </div>
        <div class="dashboard-app">
          <header class="dashboard-toolbar header-text">Support Genie</header>
        </div>
        {/* <div class="dashboard-content">
          <div class="container">
            <div class="card">
              <div class="card-body">Content</div>
            </div>
          </div>
        </div> 
        </div>*/}
      </div>
    </>
  );
};
export default ConfigSideNavBar;
