import React from 'react';
import '../Styles/footer.css';
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <div className="footer">
        
        <p>&copy; {year} HeartSource. All rights reserved.</p>
      </div>
    </>
  );
};

export default Footer;
