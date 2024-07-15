import React, { useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Logo from "../Components/../Images/HEART SOURCE ICON.png";
import "../../Styles/sidenavbar.css";

const Navbar = () => {
  const { currentComponent, setCurrentComponent } = useContext(AppContext);

  useEffect(() => {
    const showNavbar = (toggleId, navId, bodyId, headerId) => {
      const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId),
        bodypd = document.getElementById(bodyId),
        headerpd = document.getElementById(headerId);

      if (toggle && nav && bodypd && headerpd) {
        const toggleHandler = () => {
          nav.classList.toggle("show");
          toggle.classList.toggle("bx-x");
          bodypd.classList.toggle("body-pd");
          headerpd.classList.toggle("body-pd");
        };
        toggle.addEventListener("click", toggleHandler);

        return () => {
          toggle.removeEventListener("click", toggleHandler);
        };
      }
    };

    showNavbar("header-toggle", "nav-bar", "body-pd", "header");
  }, []);

  const handleNavigation = (component) => {
    setCurrentComponent(component);
  };

  return (
    <div id="body-pd">
      <header className="header" id="header">
        <img
          src={Logo}
          height="80px"
          width="80px"
          style={{ backgroundColor: "transparent" }}
        />

        <h1 className="gradient-text">SUPPORT GENIE</h1>
        <div className="header_toggle"></div>
        <div className="header_img">
          <i className="fa-solid fa-user"></i>
        </div>
      </header>
      <div className="l-navbar" id="nav-bar">
        <nav className="nav">
          <div>
            <div className="nav_list">
              <i className="fa-solid fa-bars nav_link" id="header-toggle"></i>
              <div
                onClick={() => handleNavigation("home")}
                className={`nav_link ${
                  currentComponent === "home" ? "active" : ""
                }`}
              >
                <i className="fa-solid fa-gears"></i> Agent Configuration
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
                onClick={() => handleNavigation("agentLogs")}
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
                onClick={() => handleNavigation("config-knowledge-enhancement")}
                className={`nav_link ${
                  currentComponent === "config-knowledge-enhancement"
                    ? "active"
                    : ""
                }`}
              >
                <i className="fa-solid fa-chart-line"></i> Knowledge <br />
                Enhancement
              </div>
            </div>
          </div>
          <div onClick={() => handleNavigation("home")} className="nav_link">
            <i className="fa-solid fa-right-from-bracket nav_icon"></i>
            <span className="nav_name">SignOut</span>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
