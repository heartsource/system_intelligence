import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../Components/Images/heartSourceLogoresize.png";
import UserDashboard from "./UserDashboard";

import "../../Styles/sidenavbar.css";

const Navbar = () => {
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

  const handleTextSubmit = (text) => {
    // Handle text submission logic here
    console.log("Text submitted:", text);
  };

  return (
    <div id="body-pd">
      <header className="header" id="header">
        <img src={Logo} height="70px" width="70px" />
        <h1 className="gradient-text">Support Intelligence</h1>
        <div className="header_toggle"></div>
        <div className="header_img">
          <img src="https://i.imgur.com/hczKIze.jpg" alt="" />
        </div>
      </header>
      <div className="l-navbar" id="nav-bar">
        <nav className="nav">
          <div>
            <div className="nav_list">
              <i class="fa-solid fa-bars nav_link" id="header-toggle"></i>
              <Link to="/" className="nav_link active">
                <i className="fas fa-home"></i> Home
              </Link>

              <a href="/" className="nav_link">
                <i class="fa-solid fa-pen-to-square nav_icon"></i>
                New Query
              </a>
              <a href="/" className="nav_link">
                <i className="fa-solid fa-calendar-day nav_icon"></i>
                Today
              </a>
              <a href="/" className="nav_link">
                <i class="fa-solid fa-calendar-days nav_icon"></i>Yesterday
              </a>
              <a href="/" className="nav_link">
                <i class="fas fa-history nav_icon"></i>History
              </a>
            </div>
          </div>
          <a href="/" className="nav_link">
            <i class="fa-solid fa-right-from-bracket nav_icon"></i>
            <span className="nav_name">SignOut</span>
          </a>
        </nav>
      </div>
      {/*Container Main start for dashboard*/}
      <div>
        <UserDashboard onTextSubmit={handleTextSubmit} />
      </div>
      {/*Container Main end for dashboard*/}
    </div>
  );
};

export default Navbar;
