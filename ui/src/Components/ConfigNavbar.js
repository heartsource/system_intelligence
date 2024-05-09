import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Components/Images/heartSourceLogoresize.png';
import ConfigDashboard from './ConfigDashboard';

import '../Styles/sidenavbar.css';

const Navbar = () => {
  useEffect(() => {
    const showNavbar = (toggleId, navId, bodyId, headerId) => {
      const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId),
        bodypd = document.getElementById(bodyId),
        headerpd = document.getElementById(headerId);

      if (toggle && nav && bodypd && headerpd) {
        const toggleHandler = () => {
          nav.classList.toggle('show');
          toggle.classList.toggle('bx-x');
          bodypd.classList.toggle('body-pd');
          headerpd.classList.toggle('body-pd');
        };
        toggle.addEventListener('click', toggleHandler);

        return () => {
          toggle.removeEventListener('click', toggleHandler);
        };
      }
    };

    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header');
  }, []);

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
              <a href="/" className="nav_link active">
                <i className="fas fa-home"></i> Home
              </a>
              <a href="/" className="nav_link">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
              <a href="/" className="nav_link">
                <i class="fa-solid fa-upload"></i>Upload Documents
              </a>
              <a href="/" className="nav_link">
                <i class="fa-solid fa-link"></i>Upload Wiki Links
              </a>

              <Link to="/ask-hearty" className="nav_link">
                <i className="fa-solid fa-heart"></i>Ask Hearty
              </Link>
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
        <ConfigDashboard />
      </div>
      {/*Container Main end for dashboard*/}
    </div>
  );
};

export default Navbar;
