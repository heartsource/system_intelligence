import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/configAgentDetails.css";

const ConfigAgentDetails = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("");
  const [flow, setFlow] = useState("");
  const [template, setTemplate] = useState("");
  const [models, setModels] = useState([]);
  const [flows, setFlows] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const CHATGPT4_FLOW = ["RAG"];

  const handleSave = async () => {
    try {
      const response = await axios.post("", {
        name,
        description,
        model,
        flow,
        template,
      });
      if (response.status >= 200 && response.status <= 299) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        setError(
          "There was an error updating the agent details.Please try again later."
        );
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (error) {
      console.log("error:" + error);
    }
  };

  return (
    <>
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
                />
              </div>

              <div className="agentdetails-input-row">
                <label htmlFor="description">Agent Description</label>
                <textarea
                  id="description"
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
                  value=""
                  style={{
                    marginLeft: "-0.2em",
                  }}
                >
                  <option value="">Select</option>
                  <option value="">ChatGpt4</option>
                  <option value="">RAG</option>
                </select>
              </div>
              <div className="agentdetails-input-row">
                <label htmlFor="flow">
                  Select Flow <sup>*</sup>
                </label>
                <select
                  id="flow"
                  value=""
                  style={{
                    marginLeft: "-0.2em",
                  }}
                >
                  <option value="">Select</option>
                  <option value="">ChatGpt4</option>
                  <option value="">RAG</option>
                </select>
              </div>
              <div className="agentdetails-input-row">
                <label htmlFor="template">
                  Template <sup>*</sup>
                </label>
                <textarea id="template" value=""></textarea>
              </div>
              <div>
                <label htmlFor="button"></label>
              </div>
              <div className="agentDetails-button-container">
                <button className="btn-grad">Save</button>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default ConfigAgentDetails;
