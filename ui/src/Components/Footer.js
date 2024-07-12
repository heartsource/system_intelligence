import React from "react";
import "../Styles/footer.css";
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <div className="footer">
        <span>&copy; {year} HeartSource. All rights reserved.</span>
      </div>
    </>
  );
};

export default Footer;
