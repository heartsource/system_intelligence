import React, { useState } from 'react';
import ConfigDashboard from '../Components/ConfigUser/ConfigDashboard';
import Home from './Home';
import ConfigAskHearty from '../Components/ConfigUser/ConfigAskHearty';
import ConfigNavbar from '../Components/ConfigUser/ConfigNavbar';
import Footer from './Footer';

const App = () => {
  const [currentComponent, setCurrentComponent] = useState('home');

  const handleTextSubmit = (text) => {
    console.log('Text submitted:', text);
    // perform any further actions here, such as making an API call, updating state, etc.
  };

  const renderComponent = () => {
    switch (currentComponent) {
      case 'home':
        return <Home />;
      case 'upload':
        return <ConfigDashboard />;
      case 'config-ask-hearty':
        return <ConfigAskHearty onTextSubmit={handleTextSubmit} />;
      default:
        return <Home />;
    }
  };

  return (
    <div>
      <ConfigNavbar setCurrentComponent={setCurrentComponent} />

      <div className="container">
        {renderComponent()}
      </div>
      
      <Footer />
    </div>
  );
};

export default App;


// import React from 'react';
// import Login from './ConfigUser/Login';
// const App = () => {
//   return (
//     <>
//       <Login />
//     </>
//   );
// };

// export default App;



