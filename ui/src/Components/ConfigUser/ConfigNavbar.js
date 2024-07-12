import React, { useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Logo from "../Components/../Images/HEART SOURCE ICON.png";
import "../../Styles/sidenavbar.css";

const Navbar = () => {
  const { setCurrentComponent } = useContext(AppContext);
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
                onClick={() => setCurrentComponent("home")}
                className="nav_link active"
              >
                <i className="fa-solid fa-gears"></i> Agent Configuration
              </div>
              <div
                onClick={() => setCurrentComponent("agents")}
                className="nav_link"
              >
                <i class="fas fa-users"></i> Agents
              </div>

              <div
                onClick={() => setCurrentComponent("agentLogs")}
                className="nav_link"
              >
                <i class="fa-solid fa-headset"></i> Agent Logs
              </div>
              <div
                onClick={() => setCurrentComponent("upload")}
                className="nav_link"
              >
                <i className="fa-solid fa-upload"></i> Knowledge Upload
              </div>
              <div
                onClick={() => setCurrentComponent("config-ask-hearty")}
                className="nav_link"
              >
                <i className="fa-solid fa-heart"></i> Ask Hearty
              </div>
              <div
                onClick={() =>
                  setCurrentComponent("config-knowledge-enhancement")
                }
                className="nav_link"
              >
                <i class="fa-solid fa-chart-line"></i> Knowledge <br />
                Enhancement
              </div>
            </div>
          </div>
          <div onClick={() => setCurrentComponent("home")} className="nav_link">
            <i className="fa-solid fa-right-from-bracket nav_icon"></i>
            <span className="nav_name">SignOut</span>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
