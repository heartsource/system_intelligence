import React from 'react';
import '../Styles/footer.css';
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <div className="footer">
        <h5>&copy; {year} HeartSource. All rights reserved.</h5>
      </div>
    </>
  );
};

export default Footer;
