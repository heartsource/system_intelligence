import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConfigDashboard from '../Components/ConfigUser/ConfigDashboard';
import Home from './Home';
import ConfigAskHearty from '../Components/ConfigUser/ConfigAskHearty';
import ConfigNavbar from '../Components/ConfigUser/ConfigNavbar';
import Footer from './Footer';

const App = () => {
  const handleTextSubmit = (text) => {
    console.log('Text submitted:', text);
    // perform any further actions here, such as making an API call, updating state, etc.
  };

  return (
    <Router>
      <ConfigNavbar />

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<ConfigDashboard />} />
          <Route
            path="/config-ask-hearty"
            element={<ConfigAskHearty onTextSubmit={handleTextSubmit} />}
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
