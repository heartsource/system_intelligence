import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Styles/configuration.css';

const Configuration = () => {
  const [models, setModels] = useState([]);
  const [flows, setFlows] = useState([]);
  const [template, setTemplate] = useState(
    () => sessionStorage.getItem('template') || ''
  );
  const [selectedModel, setSelectedModel] = useState(
    () => sessionStorage.getItem('model') || ''
  );
  const [selectedFlow, setSelectedFlow] = useState(
    () => sessionStorage.getItem('flow') || ''
  );
  const [isSaved, setIsSaved] = useState(
    () => sessionStorage.getItem('isSaved') === 'true'
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Debugging: log session storage values
    console.log('Session storage on mount:', {
      model: sessionStorage.getItem('model'),
      flow: sessionStorage.getItem('flow'),
      template: sessionStorage.getItem('template'),
      isSaved: sessionStorage.getItem('isSaved'),
    });

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'http://4.255.69.143/heartie-be/get_ai_prompts/'
      );
      
      const { models, flows, template } = response.data;

      setModels(models);
      setFlows(flows);

      if (!sessionStorage.getItem('template')) {
        setTemplate(template);
        sessionStorage.setItem('template', template);
      }

      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('There was an error fetching data. Please try again later.');
    }
  };

  useEffect(() => {
    sessionStorage.setItem('model', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    sessionStorage.setItem('flow', selectedFlow);
  }, [selectedFlow]);

  useEffect(() => {
    sessionStorage.setItem('template', template);
  }, [template]);

  useEffect(() => {
    sessionStorage.setItem('isSaved', isSaved);
  }, [isSaved]);

  const handleSave = () => {
    setIsSaved(true);
    setShowSuccess(true);
    console.log('Configuration saved:', {
      selectedModel,
      selectedFlow,
      template,
    });

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleEdit = () => {
    setIsSaved(false);
    console.log('Editing configuration');
  };

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {showSuccess && (
        <div className="alert alert-success" role="alert">
          Configuration saved successfully!
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
            <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isSaved}
            >
              <option value="">Select</option>
              {models.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="flow">Select Flow</label>
            <select
              id="flow"
              value={selectedFlow}
              onChange={(e) => setSelectedFlow(e.target.value)}
              disabled={isSaved}
            >
              <option value="">Select</option>
              {flows.map((flow, index) => (
                <option key={index} value={flow}>
                  {flow}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="template">Template</label>
            <textarea
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              disabled={isSaved}
            ></textarea>
          </div>
          <div>
            <label htmlFor="button"></label>
          </div>
          <div>
            {isSaved ? (
              <button className="btn-grad" onClick={handleEdit}>
                Edit Configuration
              </button>
            ) : (
              <button className="btn-grad" onClick={handleSave}>
                Save Configuration
              </button>
            )}
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default Configuration;
