import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/configAddAgent.css";

const ConfigAddAgent = () => {
  const [agentName, setAgentName] = useState("");
  const [models, setModels] = useState([]);
  const [flows, setFlows] = useState([]);
  const [template, setTemplate] = useState(
    () => sessionStorage.getItem("template") || ""
  );
  const [selectedModel, setSelectedModel] = useState(
    () => sessionStorage.getItem("model") || ""
  );
  const [selectedFlow, setSelectedFlow] = useState(
    () => sessionStorage.getItem("flow") || ""
  );
  const [isSaved, setIsSaved] = useState(
    () => sessionStorage.getItem("isSaved") === "true"
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formErrors, setFormErrors] = useState({
    agentName: "",
    model: "",
    flow: "",
    template: "",
  });

  useEffect(() => {
    console.log("Session storage on mount:", {
      model: sessionStorage.getItem("model"),
      flow: sessionStorage.getItem("flow"),
      template: sessionStorage.getItem("template"),
      isSaved: sessionStorage.getItem("isSaved"),
    });

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://4.255.69.143/heartie-be/get_ai_prompts/"
      );

      const { models, flows, template } = response.data;

      setModels(models);
      setFlows(flows);

      if (!sessionStorage.getItem("template")) {
        setTemplate(template);
        sessionStorage.setItem("template", template);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("There was an error fetching data. Please try again later.");
    }
  };

  useEffect(() => {
    sessionStorage.setItem("model", selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    sessionStorage.setItem("flow", selectedFlow);
  }, [selectedFlow]);

  useEffect(() => {
    sessionStorage.setItem("template", template);
  }, [template]);

  useEffect(() => {
    sessionStorage.setItem("isSaved", isSaved);
  }, [isSaved]);

  const handleSave = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      setIsSaved(true);
      setShowSuccess(true);
      console.log("Configuration saved:", {
        selectedModel,
        selectedFlow,
        template,
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } else {
      setFormErrors(errors);
    }
  };

  const handleEdit = () => {
    setIsSaved(false);
    console.log("Editing configuration");
  };

  const validateForm = () => {
    const errors = {};
    if (!agentName) {
      errors.agentName = "* Agent Name is required.";
    }
    if (!selectedModel || selectedModel === "Select") {
      errors.model = "* Model is required";
    }
    if (!selectedFlow || selectedFlow === "Select") {
      errors.flow = "* Flow is required";
    }
    if (!template) {
      errors.template = "* Template is required.";
    }
    return errors;
  };

  const handleInputChange = (e, field) => {
    if (formErrors[field]) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }
    const { value } = e.target;
    if (field === "model") {
      setSelectedModel(value);
    } else if (field === "flow") {
      setSelectedFlow(value);
    } else if (field === "template") {
      setTemplate(value);
    } else if (field === "agentName") {
      setAgentName(value);
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
        <fieldset id="fieldsetAddAgent">
          <legend>
            Agent Configuration
            <i className="fa-solid fa-gears"></i>
          </legend>
          <hr className="configuration_form" />

          <div>
            <label htmlFor="agentName">
              Agent Name <sup>*</sup>
            </label>
            <input
              type="text"
              id="agentName"
              value={agentName}
              style={{
                border: formErrors.agentName
                  ? "2px solid #bb2124"
                  : "1px solid #ccc",
                marginBottom: formErrors.agentName ? "0" : "initial",
              }}
              placeholder="Enter Agent Name"
              onChange={(e) => handleInputChange(e, "agentName")}
              disabled={isSaved}
            />
            {formErrors.agentName && (
              <span className="error" style={{ marginTop: "5em" }}>
                {formErrors.agentName}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="description">Agent Description</label>
            <textarea
              id="description"
              placeholder="You can add a few lines here to describe what this Agent will do."
              disabled={isSaved}></textarea>
          </div>
          <div>
            <label htmlFor="model">
              Select Model <sup>*</sup>
            </label>
            <select
              id="model"
              value={selectedModel}
              style={{
                border: formErrors.model
                  ? "2px solid #bb2124"
                  : "1px solid #ccc",
                marginBottom: formErrors.model ? "0" : "initial",
              }}
              onChange={(e) => handleInputChange(e, "model")}
              disabled={isSaved}>
              <option value="Select">Select</option>
              {models.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
            {formErrors.model && (
              <span className="error" style={{ marginTop: "5em" }}>
                {formErrors.model}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="flow">
              Select Flow <sup>*</sup>
            </label>
            <select
              id="flow"
              value={selectedFlow}
              style={{
                border: formErrors.flow
                  ? "2px solid #bb2124"
                  : "1px solid #ccc",
                marginBottom: formErrors.flow ? "0" : "initial",
              }}
              onChange={(e) => handleInputChange(e, "flow")}
              disabled={isSaved}>
              <option value="Select">Select</option>
              {models.map((model, index) => (
                <option key={index} value={flows}>
                  {flows}
                </option>
              ))}
            </select>
            {formErrors.flow && (
              <span className="error" style={{ marginTop: "5em" }}>
                {formErrors.flow}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="template">
              Template <sup>*</sup>
            </label>
            <textarea
              id="template"
              value={template}
              style={{
                border: formErrors.template
                  ? "2px solid #bb2124"
                  : "1px solid #ccc",
                marginBottom: formErrors.template ? "0" : "initial",
              }}
              onChange={(e) => handleInputChange(e, "template")}
              disabled={isSaved}></textarea>
          </div>
          {formErrors.template && (
            <span className="error" style={{ marginTop: "5em" }}>
              {formErrors.template}
            </span>
          )}
          <div>
            <button className="btn-grad" onClick={handleSave}>
              Create Agent
            </button>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default ConfigAddAgent;
