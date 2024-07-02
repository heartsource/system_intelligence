import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/configAddAgent.css";

const ConfigAddAgent = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [models, setModels] = useState([]);
  const [flows, setFlows] = useState([]);
  const [template, setTemplate] = useState("");
  const [model, setModel] = useState("");
  const [flow, setFlow] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    name: "",
    model: "",
    flow: "",
    template: "",
  });

  const CHATGPT4_FLOW = ["RAG"];

  useEffect(() => {
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
      setTemplate(template);
      setError(null);
    } catch (error) {
      setError("There was an error fetching data. Please try again later.");
    }
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          "http://4.255.69.143/heartie-be/agents/create-agent",
          {
            name,
            description,
            model,
            flow,
            template,
          }
        );

        if (response.status >= 200 && response.status <= 299) {
          setIsSaved(true);
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
          //Reset the form
          setName("");
          setDescription("");
          setModel("");
          setFlow("");
          setTemplate("");
          setFormErrors({
            name: "",
            model: "",
            flow: "",
            template: "",
          });
        } else {
          setError(
            "There was an error saving the configuration. Please try again later."
          );
        }
      } catch (error) {
        setError(
          "There was an error saving the configuration. Please try again later."
        );
      }
    } else {
      setFormErrors(errors);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!name) {
      errors.name = "* Agent Name is required.";
    }
    if (!model || model === "Select") {
      errors.model = "* Model is required";
    }
    if (!flow || flow === "Select") {
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
      setModel(value);
      setFlow(""); // Reset flow when model changes
    } else if (field === "flow") {
      setFlow(value);
    } else if (field === "template") {
      setTemplate(value);
    } else if (field === "name") {
      setName(value);
    } else if (field === "description") {
      setDescription(value);
    }
  };

  const filteredFlows = model === "ChatGPT4" ? CHATGPT4_FLOW : flows;

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
            <label htmlFor="name">
              Agent Name <sup>*</sup>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              style={{
                border: formErrors.name
                  ? "2px solid #bb2124"
                  : "1px solid #ccc",
                marginBottom: formErrors.name ? "0" : "initial",
              }}
              placeholder="Enter Agent Name"
              onChange={(e) => handleInputChange(e, "name")}
              disabled={isSaved}
            />
            {formErrors.name && (
              <span className="error" style={{ marginTop: "5em" }}>
                {formErrors.name}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="description">Agent Description</label>
            <textarea
              id="description"
              placeholder="You can add a few lines here to describe what this Agent will do."
              disabled={isSaved}
              onChange={(e) => handleInputChange(e, "description")}
            ></textarea>
          </div>
          <div>
            <label htmlFor="model">
              Select Model <sup>*</sup>
            </label>
            <select
              id="model"
              value={model}
              style={{
                border: formErrors.model
                  ? "2px solid #bb2124"
                  : "1px solid #ccc",
                marginBottom: formErrors.model ? "0" : "initial",
              }}
              onChange={(e) => handleInputChange(e, "model")}
              disabled={isSaved}
            >
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
              value={flow}
              style={{
                border: formErrors.flow
                  ? "2px solid #bb2124"
                  : "1px solid #ccc",
                marginBottom: formErrors.flow ? "0" : "initial",
              }}
              onChange={(e) => handleInputChange(e, "flow")}
              disabled={isSaved}
            >
              <option value="Select">Select</option>
              {filteredFlows.map((flow, index) => (
                <option key={index} value={flow}>
                  {flow}
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
              disabled={isSaved}
            ></textarea>
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
