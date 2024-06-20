import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Styles/configuration.css';

const ConfigAddAgent = () => {
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

  const [formErrors,setFormErrors] = useState({
    agentName:'',
    model:'',
    flow:'',
    template:''
  });

  useEffect(() => {
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
    const errors = validateForm();
    if(Object.keys(errors).length === 0){
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
  }else{
    setFormErrors(errors);
  }};

  const handleEdit = () => {
    setIsSaved(false);
    console.log('Editing configuration');
  };

  const validateForm = () => {
    const errors = {};
    if(!document.querySelector('#agentName').value){
      errors.agentName = '* Agent Name is required.'
    }
    if (!selectedModel) {
      errors.model = '* Model is required';
    }
    if(!selectedFlow){
      errors.flow = '* Flow is required';
    }
    if (!template) {
      errors.template = '* Template is required';
    }
    return errors;
  }

  const handleInputChange = (e, field) => {
    if (formErrors[field]) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    }
    if (field === 'model') {
      setSelectedModel(e.target.value);
    } else if (field === 'flow') {
      setSelectedFlow(e.target.value);
    } else if (field === 'template') {
      setTemplate(e.target.value);
    }
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
            Agent Configuration
            <i className="fa-solid fa-gears"></i>
          </legend>
          <hr className="configuration_form" />
          <div>
            <label htmlFor="agentName">Agent Name <sup>*</sup></label>
            <input type="text" id="agentName" placeholder='Enter Agent Name'
             onChange={() => setFormErrors((prevErrors) => ({ ...prevErrors, agentName: '' }))}/>
            {formErrors.agentName && (
              <div className="error">{formErrors.agentName}</div>
            )}
          </div>
          <div>
            <label htmlFor="description">Agent Description</label>
            <textarea
              id="description"
              placeholder='You can add a few lines here to describe what this Agent will do.'
            ></textarea>
          </div>
          <div>
            <label htmlFor="model">Select Model <sup>*</sup></label>
            <select
              id="model"
              value={selectedModel}
              onChange={(e) => handleInputChange(e, 'model')}
              // onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isSaved}
            >
              <option value="">Select</option>
              {models.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
            {formErrors.model && (
              <div className="error">{formErrors.model}</div>
            )}
          </div>
          <div>
            <label htmlFor="flow">Select Flow<sup>*</sup></label>
            <select
              id="flow"
              value={selectedFlow}
              onChange={(e) => handleInputChange(e, 'flow')}
              // onChange={(e) => setSelectedFlow(e.target.value)}
              disabled={isSaved}
            >
              <option value="">Select</option>
              {flows.map((flow, index) => (
                <option key={index} value={flow}>
                  {flow}
                </option>
              ))}
            </select>
            {formErrors.flow && (
              <div className="error">{formErrors.flow}</div>
            )}
          </div>
          <div>
            <label htmlFor="template">Template <sup>*</sup></label>
            <textarea
              id="template"
              value={template}
              onChange={(e) => handleInputChange(e, 'template')}
              // onChange={(e) => setTemplate(e.target.value)}
              disabled={isSaved}
              
            ></textarea>
            {formErrors.template && (
              <div className="error">{formErrors.template}</div>
            )}
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
                Create Agent
              </button>
            )}
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default ConfigAddAgent;
