import React, { useContext, useState } from "react";
import "../../Styles/configKnowledgeEnrichmentDetails.css";
import { AppContext } from "../../context/AppContext";
import { capitalizeFirstLetter } from "../../utils/camelCase";

const getStatusClass = (status) => {
  switch (status) {
    case "injested":
      return "status-injested";
    case "responded":
      return "status-responded";
    case "inquired":
      return "status-inquired";
    default:
      return "status-default";
  }
};

const ConfigKnowledgeEnrichmentDetails = () => {
  const { selectedEnrichmentId } = useContext(AppContext);

  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  return (
    <div className="form-container">
      <fieldset id="enrichmentDetailsFieldset">
        <legend id="agentDetailsLegend">
          Knowledge Enrichment Request Details
        </legend>
        <hr />
        <div className="top-right-container">
          <div className="view-agent-logs">
            <div className="status">
              <span>Status</span>
              <span className={getStatusClass(selectedEnrichmentId.status)}>
                {capitalizeFirstLetter(selectedEnrichmentId.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="form-content">
          <div className="form-group">
            <label>Enrichment Id</label>
            <span className="labelValue">
              {selectedEnrichmentId.enrichment_id}
            </span>
          </div>
          <div className="form-group">
            <label>Query</label>
            <textarea readOnly value={selectedEnrichmentId.query} />
          </div>
          <div className="form-group">
            <label></label>
            <p className="form-description">
              You can either write your response here or{" "}
              <a
                href="#"
                style={{ color: "rgb(45, 182, 212)", fontWeight: "bold" }}
              >
                {""}upload {""}
              </a>
              the documents containing the response to the query below.
            </p>
          </div>
          <div className="form-group" id="response-text-area">
            <label>Enter Response</label>
            <textarea
              id="response"
              placeholder="Enter response here"
              value={selectedEnrichmentId.response}
              rows={7}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Upload Response Document(s)</label>
            <button className="upload-btn">Upload</button>
          </div>
          <div className="form-group">
            <label>Request Date</label>
            <div className="labelValue">
              {selectedEnrichmentId.requested_on}
            </div>
          </div>
          <div className="form-group">
            <label>Response Date</label>
            <div className="labelValue">
              {selectedEnrichmentId.responded_on}
            </div>
          </div>
          <div className="form-group">
            <label>Ingested Date</label>
            <div className="labelValue">{selectedEnrichmentId.injested_on}</div>
          </div>
          <div className="form-group save-btn-container">
            <label></label>
            <button className="save-btn">Save</button>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default ConfigKnowledgeEnrichmentDetails;
