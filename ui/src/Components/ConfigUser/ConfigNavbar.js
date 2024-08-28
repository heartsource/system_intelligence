import React, { useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Logo from "../Components/../Images/HEART SOURCE ICON.png";
import "../../Styles/sidenavbar.css";

const Navbar = () => {
  const { currentComponent, setCurrentComponent, setSelectedAgentId } =
    useContext(AppContext);

  useEffect(() => {
    const showNavbar = (expand) => {
      const nav = document.getElementById("nav-bar");
      const bodypd = document.getElementById("body-pd");
      const headerpd = document.getElementById("header");

      if (nav && bodypd && headerpd) {
        if (expand) {
          nav.classList.add("show");
          bodypd.classList.add("container");
          // bodypd.classList.add("body-pd");
          headerpd.classList.add("body-pd");
        } else {
          nav.classList.remove("show");
          bodypd.classList.remove("container");
          // bodypd.classList.remove("body-pd");
          headerpd.classList.remove("body-pd");
        }
      }
    };

    const navBar = document.getElementById("nav-bar");
    if (navBar) {
      navBar.addEventListener("mouseenter", () => showNavbar(true));
      navBar.addEventListener("mouseleave", () => showNavbar(false));

      return () => {
        navBar.removeEventListener("mouseenter", () => showNavbar(true));
        navBar.removeEventListener("mouseleave", () => showNavbar(false));
      };
    }
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
      </header>
      <div className="headerName">
        <h1 className="gradient-text">SUPPORT GENIE</h1>
        <div className="header_toggle"></div>
        <div className="header_img">
          <i className="fa-solid fa-user"></i>
        </div>
      </div>
      {/* </header> */}

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
            </div>
          </div>

          <div onClick={() => handleNavigation("profile")} className="nav_link">
            <i class="fa-solid fa-right-from-bracket"></i> Log Out
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
