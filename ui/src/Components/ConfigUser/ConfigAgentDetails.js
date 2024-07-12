import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../../Styles/configAgentDetails.css";
import { AppContext } from "../../context/AppContext";
import { requestToggleStatus } from "../../utils/modal";

const ConfigAgentDetails = () => {
  const { selectedAgent } = useContext(AppContext);

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
      const response = await axios.get(
        "http://4.255.69.143/heartie-be/get_ai_prompts/"
      );

      const { models, flows } = response.data;
      setModels(models || []);
      setFlows(flows || []);
    } catch (error) {
      setError("Server is down. Please try again later.");
      setTimeout(() => {
        setError(null);
      }, 5000);
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

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://4.255.69.143/heartie-be/agents/${selectedAgent.id}`,
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
        setError(
          "There was an error updating the agent details. Please try again later."
        );
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } catch (error) {
      console.log("Error:", error);
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
                <label>View Agent Logs</label>
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
                  onChange={(e) => setName(e.target.value)}
                />
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
                  onChange={(e) => setModel(e.target.value)}
                  style={{
                    marginLeft: "-0.2em",
                  }}
                >
                  <option value="">Select</option>
                  {models.map((modelOption, index) => (
                    <option key={index} value={modelOption}>
                      {modelOption}
                    </option>
                  ))}
                </select>
              </div>
              <div className="agentdetails-input-row">
                <label htmlFor="flow">
                  Select Flow <sup>*</sup>
                </label>
                <select
                  id="flow"
                  value={flow}
                  onChange={(e) => setFlow(e.target.value)}
                  style={{
                    marginLeft: "-0.2em",
                  }}
                >
                  <option value="">Select</option>
                  {filteredFlows.map((flowOption, index) => (
                    <option key={index} value={flowOption}>
                      {flowOption}
                    </option>
                  ))}
                </select>
              </div>
              <div className="agentdetails-input-row">
                <label htmlFor="template">
                  Template <sup>*</sup>
                </label>
                <textarea
                  id="template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                ></textarea>
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
