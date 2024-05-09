import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import SideNavbar from '../Components/Users/SideNavbar';
import Footer from './Footer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ask-hearty" element={<SideNavbar />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
