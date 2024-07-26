import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../../Styles/configAgentDetails.css";
import { AppContext } from "../../context/AppContext";
import { requestToggleStatus } from "../../utils/modal";
import { handleError } from "../../utils/handleError";
import config from '../../config'

const ConfigAgentDetails = () => {
  const { selectedAgent, setCurrentComponent, setLogs, setSelectedAgentId } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("");
  const [flow, setFlow] = useState("");
  const [models, setModels] = useState([]);
  const [flows, setFlows] = useState([]);
  const [template, setTemplate] = useState("");
  const [status, setStatus] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    name: "",
    model: "",
    flow: "",
    template: "",
  });

  const [modalInfo, setModalInfo] = useState({
    show: false,
    index: -1,
    newStatus: "",
  });

  useEffect(() => {
    if (selectedAgent) {
      setName(selectedAgent.name || "");
      setDescription(selectedAgent.description || "");
      setModel(selectedAgent.model || "");
      setFlow(selectedAgent.flow || "");
      setTemplate(selectedAgent.template || "");
      setStatus(selectedAgent.status || "");
    }
  }, [selectedAgent]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.heartieBE}/get_ai_prompts/`);

      const { models, flows } = response.data;
      setModels(models || []);
      setFlows(flows || []);
    } catch (error) {
      handleError(setError, "Server is down. Please try again later.");
    }
  };

  const handleStatusToggle = () => {
    requestToggleStatus([{ status }], setModalInfo, 0);
  };

  useEffect(() => {
    if (modalInfo.show) {
      setStatus(modalInfo.newStatus);
    }
  }, [modalInfo]);

  const validateField = (name, value) => {
    let error = "";
    if (!value.trim()) {
      error = `* ${name} is required.`;
    }
    return error;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      name: validateField("Agent name", value),
    }));
  };

  const handleModelChange = (e) => {
    const value = e.target.value;
    setModel(value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      model: validateField("Model selection", value),
    }));
  };

  const handleFlowChange = (e) => {
    const value = e.target.value;
    setFlow(value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      flow: validateField("Flow selection", value),
    }));
  };

  const handleTemplateChange = (e) => {
    const value = e.target.value;
    setTemplate(value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      template: validateField("Template", value),
    }));
  };

  const handleSave = async () => {
    if (!name || !model || !flow || !template) {
      setFormErrors({
        name: validateField("Agent name", name),
        model: validateField("Model selection", model),
        flow: validateField("Flow selection", flow),
        template: validateField("Template", template),
      });
      return;
    }

    try {
      const response = await axios.put(
        `${config.heartieBE}/agents/${selectedAgent._id}`,
        {
          name,
          description,
          model,
          flow,
          template,
          status,
        }
      );
      if (response.status >= 200 && response.status <= 299) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        handleError(
          setError,
          "There was an error updating the agent details. Please try again later."
        );
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.data &&
        error.response.data.data.includes("Agent with name already exists")
      ) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          name: "* Name already exists. Please try a different name.",
        }));
      } else {
        console.log("Error:", error);
      }
    }
  };

  const viewAgentLogsClick = async () => {
    try {
      const payload = { agent_ids: [selectedAgent._id] };
      const response = await axios.post(
        `${config.heartieBE}/logs/`,
        payload
      );
      if (response.data.status === "error") {
        handleError(setError, response.data.data);
      } else {
        setLogs(response.data.data);
        setSelectedAgentId(selectedAgent._id);
        setCurrentComponent("agentLogs");
      }
    } catch (error) {
      handleError(setError, "No Record Found.");
    }
  };

  const CHATGPT4_FLOW = ["RAG"];
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
          Agent "{selectedAgent.name}" updated successfully!
        </div>
      )}
      <div className="agentDetails-fieldset-container">
        <fieldset id="agentDetailsFieldset">
          <legend id="agentDetailsLegend">
            Agent Details
            <i className="fa-solid fa-user-pen"></i>
          </legend>
          <hr />
          <div>
            <div className="top-right-container">
              <div className="view-agent-logs">
                <label
                  style={{ cursor: "pointer" }}
                  onClick={viewAgentLogsClick}
                >
                  View Agent Logs
                </label>
              </div>
              <div className="status-switch">
                <label>Status</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    data-toggle="tooltip"
                    data-placement="top"
                    checked={status === "active"}
                    onChange={handleStatusToggle}
                    title={status === "active" ? "Disable" : "Enable"}
                  />
                </div>
              </div>
            </div>
            <div className="flex-container">
              <div className="agentdetails-input-row">
                <label htmlFor="agentName">
                  Agent Name <sup>*</sup>
                </label>
                <input
                  type="text"
                  id="agentName"
                  placeholder="Enter Agent Name"
                  value={name}
                  onChange={handleNameChange}
                  style={{
                    border: formErrors.name
                      ? "2px solid #bb2124"
                      : "1px solid #ccc",
                    marginBottom: formErrors.name ? "0" : "initial",
                  }}
                />
                {formErrors.name && (
                  <span
                    className="error"
                    style={{ marginTop: "5em", padding: "0px" }}
                  >
                    {formErrors.name}
                  </span>
                )}
              </div>
              <div className="agentdetails-input-row">
                <label htmlFor="description">Agent Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="You can add a few lines here to describe what this Agent will do."
                  style={{
                    marginLeft: ".6em",
                  }}
                ></textarea>
              </div>
              <div className="agentdetails-input-row">
                <label htmlFor="model">
                  Select Model <sup>*</sup>
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={handleModelChange}
                  style={{
                    border: formErrors.model
                      ? "2px solid #bb2124"
                      : "1px solid #ccc",
                    marginBottom: formErrors.model ? "0" : "initial",
                  }}
                >
                  <option value="">Select</option>
                  {models.map((modelOption, index) => (
                    <option key={index} value={modelOption}>
                      {modelOption}
                    </option>
                  ))}
                </select>
                {formErrors.model && (
                  <span
                    className="error"
                    style={{ marginTop: "5em", padding: "0px" }}
                  >
                    {formErrors.model}
                  </span>
                )}
              </div>
              <div className="agentdetails-input-row">
                <label htmlFor="flow">
                  Select Flow <sup>*</sup>
                </label>
                <select
                  id="flow"
                  value={flow}
                  onChange={handleFlowChange}
                  style={{
                    border: formErrors.flow
                      ? "2px solid #bb2124"
                      : "1px solid #ccc",
                    marginBottom: formErrors.flow ? "0" : "initial",
                  }}
                >
                  <option value="">Select</option>
                  {filteredFlows.map((flowOption, index) => (
                    <option key={index} value={flowOption}>
                      {flowOption}
                    </option>
                  ))}
                </select>
                {formErrors.flow && (
                  <span
                    className="error"
                    style={{ marginTop: "5em", padding: "0px" }}
                  >
                    {formErrors.flow}
                  </span>
                )}
              </div>
              <div className="agentdetails-input-row">
                <label htmlFor="template">
                  Template <sup>*</sup>
                </label>
                <textarea
                  id="template"
                  value={template}
                  onChange={handleTemplateChange}
                  style={{
                    border: formErrors.template
                      ? "2px solid #bb2124"
                      : "1px solid #ccc",
                    marginBottom: formErrors.template ? "0" : "initial",
                  }}
                ></textarea>
                {formErrors.template && (
                  <span
                    className="error"
                    style={{
                      marginTop: "18em",
                      padding: "0px",
                      marginLeft: "-64em",
                    }}
                  >
                    {formErrors.template}
                  </span>
                )}
              </div>
              <div className="agentDetails-button-container">
                <button className="btn-grad" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default ConfigAgentDetails;
