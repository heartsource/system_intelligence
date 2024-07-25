import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../../Styles/configAddAgent.css";
import { AppContext } from "../../context/AppContext";
import { handleError } from "../../utils/handleError";

const ConfigAddAgent = () => {
  const { setCurrentComponent } = useContext(AppContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [models, setModels] = useState([]);
  const [flows, setFlows] = useState([]);
  const [template, setTemplate] = useState("");
  const [model, setModel] = useState("");
  const [flow, setFlow] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    name: "",
    model: "",
    flow: "",
    template: "",
  });
  const [nameExistsError, setNameExistsError] = useState(false);

  const CHATGPT4_FLOW = ["RAG"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("REACT_APP_HEARTIE_BE: " + process.env)
      console.log("REACT_APP_HEARTIE_BE: " + process.env.REACT_APP_HEARTIE_BE)
      console.log("HEARTIE_BE: " + process.env.HEARTIE_BE)
      const response = await axios.get(
        process.env.REACT_APP_HEARTIE_BE + "/get_ai_prompts/"
      );

      const { models, flows, template } = response.data;

      setModels(models);
      setFlows(flows);
      setTemplate(template);
      setError(null);
    } catch (error) {
      handleError(setError, "Server is down. Please try again later.");
    }
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
            process.env.REACT_APP_HEARTIE_BE + "/agents/create-agent",
          {
            name,
            description,
            model,
            flow,
            template,
          }
        );

        if (response.status >= 200 && response.status <= 299) {
          setCurrentComponent("agents");

          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
          // Reset the form
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
          handleError(
            setError,
            "There was an error saving the configuration. Please try again later."
          );
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.data &&
          error.response.data.data.includes("Agent with name already exists")
        ) {
          setNameExistsError(true);
          setTimeout(() => {
            setNameExistsError(false);
          }, 3000);
        } else {
          handleError(
            setError,
            "There was an error saving the configuration. Please try again later."
          );
        }
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
    if (nameExistsError && field === "name") {
      setNameExistsError(false);
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
          Agent created successfully!
        </div>
      )}
      <div className="addAgent-fieldset-container">
        <div id="fieldsetAddAgent">
          <legend id="agentLegend">
            Agent Configuration
            <i className="fa-solid fa-gears"></i>
          </legend>
          <hr style={{ border: "1px solid white" }} />

          <div className="agent-details-new">
            <div className="agent-input-row">
              <label htmlFor="name">
                Agent Name <sup>*</sup>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                style={{
                  marginLeft: "-0.6em",
                  border:
                    nameExistsError || formErrors.name
                      ? "2px solid #bb2124"
                      : "1px solid #ccc",
                  marginBottom: formErrors.name ? "0" : "initial",
                }}
                placeholder="Enter Agent Name"
                onChange={(e) => handleInputChange(e, "name")}
              />
              {formErrors.name && (
                <span
                  className="error"
                  style={{ marginTop: "5em", padding: "0px" }}
                >
                  {formErrors.name}
                </span>
              )}
              {nameExistsError && (
                <div
                  className="error"
                  style={{ marginTop: "5em", color: "red" }}
                >
                  * Name already exists. Please try a different name.
                </div>
              )}
            </div>
            <div className="agent-input-row">
              <label htmlFor="description">Agent Description</label>
              <textarea
                id="description"
                placeholder="You can add a few lines here to describe what this Agent will do."
                onChange={(e) => handleInputChange(e, "description")}
              ></textarea>
            </div>
            <div className="agent-input-row">
              <label htmlFor="model">
                Select Model <sup>*</sup>
              </label>
              <select
                id="model"
                value={model}
                style={{
                  marginLeft: "-0.6em",
                  border: formErrors.model
                    ? "2px solid #bb2124"
                    : "1px solid #ccc",
                  marginBottom: formErrors.model ? "0" : "initial",
                }}
                onChange={(e) => handleInputChange(e, "model")}
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

            <div className="agent-input-row">
              <label htmlFor="flow">
                Select Flow <sup>*</sup>
              </label>
              <select
                id="flow"
                value={flow}
                style={{
                  marginLeft: "-0.6em",
                  border: formErrors.flow
                    ? "2px solid #bb2124"
                    : "1px solid #ccc",
                  marginBottom: formErrors.flow ? "0" : "initial",
                }}
                onChange={(e) => handleInputChange(e, "flow")}
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
            <div className="agent-input-row">
              <label htmlFor="template">
                Template <sup>*</sup>
              </label>
              <textarea
                id="template"
                value={template}
                style={{
                  marginLeft: "-0.3em",
                  border: formErrors.template
                    ? "2px solid #bb2124"
                    : "1px solid #ccc",
                  marginBottom: formErrors.template ? "0" : "initial",
                }}
                onChange={(e) => handleInputChange(e, "template")}
              ></textarea>
            </div>
          </div>
          {formErrors.template && (
            <span
              className="error"
              style={{ marginTop: "10em", marginLeft: "10em" }}
            >
              {formErrors.template}
            </span>
          )}
          <div className="button-container">
            <button className="btn-grad" onClick={handleSave}>
              Create Agent
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfigAddAgent;
