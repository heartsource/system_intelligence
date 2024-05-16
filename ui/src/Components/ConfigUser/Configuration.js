import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Styles/configuration.css';

const Configuration = () => {
  // State to store model, flow, and template options
  const [models, setModels] = useState([]);
  const [flows, setFlows] = useState([]);
  const [template, setTemplate] = useState('');

  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch models, flows, and template from API
    fetchData();
  }, []);

  // Function to fetch all data from API
  const fetchData = async () => {
    try {
      // const response = await axios.get(
      //   'http://4.255.69.143/heartie-be/get_ai_prompts/'
      // );
      const response = await axios.get('http://localhost:8000/get-ai-prompts');
      const { models, flows, template } = response.data;
      setModels(models);
      setFlows(flows);
      setTemplate(template);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('There was an error fetching data. Please try again later.');
    }
  };

  return (
    <>
      {error && ( // Display error message if there's an error
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="fieldset-container">
        <fieldset>
          <legend>
            Configuration
            <i className="fa-solid fa-gears"></i>
          </legend>
          <hr />

          <hr className="configuration_form" />
          <div>
            <label htmlFor="model">Select Model</label>
            <select id="model">
              <option>Select</option>
              {models.map((model, index) => (
                <option key={index}>{model}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="flow">Select Flow</label>
            <select id="flow">
              <option>Select</option>
              {flows.map((flow, index) => (
                <option key={index}>{flow}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="template">Template</label>
            <textarea
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label htmlFor="button"></label>
            <button className="btn-grad">Save Configuration</button>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default Configuration;
