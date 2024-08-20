import React, { useContext, useState, useEffect } from "react";
import "../../Styles/configKnowledgeEnrichmentDetails.css";
import { AppContext } from "../../context/AppContext";
import { capitalizeFirstLetter } from "../../utils/camelCase";
import config from "../../config";
import { dateFormat } from "../../utils/dateFormat";
import axios from "axios";

const getStatusClass = (status) => {
  switch (status) {
    case "ingested":
      return "status-ingested";
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
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (selectedEnrichmentId) {
      setQuery(selectedEnrichmentId.query || "");
      setResponse(selectedEnrichmentId.response || "");
    }
  }, [selectedEnrichmentId]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSave = async () => {
    if (!selectedEnrichmentId) return;
    if (!query && !files.length) {
      console.log("Either a file or query_response must be provided.");
      return;
    }
    const formData = new FormData();
    formData.append("payload", response);
    formData.append("enrichment_id", selectedEnrichmentId.enrichment_id);
    Array.from(files).forEach((file) => {
      formData.append("file", file);
    });

    try {
      const saveResponse = await axios.put(
        `${config.heartieBE}/enrichments/${selectedEnrichmentId.enrichment_id}`,
        formData
      );
      if (saveResponse.status === 200) {
        console.log("Data saved successfully");
      } else {
        console.error("Save failed", saveResponse);
      }
    } catch (error) {
      console.error(
        "An error occurred while saving the data",
        error.response || error.message || error
      );
    }
  };

  if (!selectedEnrichmentId) {
    return <div>Loading...</div>;
  }

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
            <span style={{ color: "white" }}>
              {selectedEnrichmentId.enrichment_id}
            </span>
          </div>
          <div className="form-group">
            <label>Query</label>
            <textarea
              id="query"
              readOnly
              placeholder="Enter query here"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label></label>
            <p className="form-description">
              You can either write your response here or{" "}
              <a
                href="#"
                style={{ color: "rgb(45, 182, 212)", fontWeight: "bold" }}
                onClick={() => document.getElementById("file-upload").click()}
              >
                upload
              </a>{" "}
              the documents containing the response to the query below.
            </p>
          </div>
          <div className="form-group" id="response-text-area">
            <label>Enter Response</label>
            <textarea
              id="response"
              placeholder="Enter response here"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={7}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Upload Response Document(s)</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="file-input"
              style={{ display: "none" }}
              id="file-upload"
            />
            <button
              className="upload-btn"
              onClick={() => document.getElementById("file-upload").click()}
            >
              Upload
            </button>
            <span className="file-names">
              {Array.from(files)
                .map((file) => file.name)
                .join(", ")}
            </span>
          </div>
          <div className="form-group date-row">
            <div className="date-group">
              <label>Request Date</label>
              <div className="labelValue">
                {dateFormat(selectedEnrichmentId.requested_on)}
              </div>
            </div>
            <div className="date-group">
              <label>Response Date</label>
              <div className="labelValue">
                {dateFormat(selectedEnrichmentId.responded_on)}
              </div>
            </div>
            <div className="date-group">
              <label>Ingested Date</label>
              <div className="labelValue">
                {dateFormat(selectedEnrichmentId.injested_on)}
              </div>
            </div>
          </div>
          <div className="form-group save-btn-container">
            <label></label>
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default ConfigKnowledgeEnrichmentDetails;
