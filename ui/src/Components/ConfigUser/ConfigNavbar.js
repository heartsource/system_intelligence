import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Logo from "../Components/../Images/WhiteLogo-removebg.png";
import "../../Styles/sidenavbar.css";

const Navbar = () => {
  const { currentComponent, setCurrentComponent, setSelectedAgentId } =
    useContext(AppContext);

  const handleNavigation = (component) => {
    setCurrentComponent(component);
  };

  return (
    <div id="body-pd">
      <header className="header" id="header">
        <div className="headerName">
          <h1 className="header_text">SUPPORT GENIE</h1>
        </div>
      </header>

      <div className="l-navbar" id="nav-bar">
        <nav className="nav">
          <div className="nav_list">
            <div className="nav_logo">
              <img src={Logo} />
            </div>
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
              <i className="fa-solid fa-upload"></i> Knowledge <br />
              Upload
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
          </div>

          <div onClick={() => handleNavigation("profile")} className="nav_link">
            <i className="fa-solid fa-right-from-bracket"></i> Log Out
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
