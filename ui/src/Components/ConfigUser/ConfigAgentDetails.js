import React from "react";

const ConfigAgentDetails = () => {
  return (
    <>
      <div className="fieldset-container" style={{ marginTop: "-7em" }}>
        <fieldset>
          <legend>
            Agent Details
            <i class="fa-solid fa-user-pen"></i>
          </legend>
          <hr className="configuration_form" />
          <div className="d-flex justify-content-end mb-3">
            <label className="text-end">View Agent Logs</label>
          </div>

          <div>
            <label htmlFor="agentName">
              Agent Name <sup>*</sup>
            </label>
            <input type="text" id="agentName" placeholder="Enter Agent Name" />
            <div className="d-flex justify-content-end mb-3">
              <label className="text-end">Status</label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="description">Agent Description</label>
            <textarea
              id="description"
              placeholder="You can add a few lines here to describe what this Agent will do."></textarea>
          </div>
          <div>
            <label htmlFor="model">
              Select Model <sup>*</sup>
            </label>
            <select id="model" value="">
              <option value="">Select</option>
              <option value="">ChatGpt4</option>
              <option value="">RAG</option>
            </select>
          </div>
          <div>
            <label htmlFor="flow">
              Select Flow <sup>*</sup>
            </label>
            <select id="flow" value="">
              <option value="">Select</option>
              <option value="">ChatGpt4</option>
              <option value="">RAG</option>
            </select>
          </div>
          <div>
            <label htmlFor="template">
              Template <sup>*</sup>
            </label>
            <textarea id="template" value=""></textarea>
          </div>
          <div>
            <label htmlFor="button"></label>
          </div>
          <div>
            <button className="btn-grad">Save</button>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default ConfigAgentDetails;
