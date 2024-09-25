import React, { useContext, useState, useEffect } from "react";
import "../../Styles/configKnowledgeEnrichmentDetails.css";
import { AppContext } from "../../context/AppContext";
import config from "../../config";
import { dateFormat } from "../../utils/dateFormat";
import axios from "axios";
import { handleError } from "../../utils/handleError";
import Badge from "../Badge";

const ConfigKnowledgeEnrichmentDetails = () => {
  const { selectedEnrichmentId, setCurrentComponent } = useContext(AppContext);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null); // Single file
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (selectedEnrichmentId) {
      setQuery(selectedEnrichmentId.query || "");
      setResponse(selectedEnrichmentId.response || "");
    }
  }, [selectedEnrichmentId]);

  const handleFileChange = (event) => {
    const newFile = event.target.files[0]; // Get single file
    setFile(newFile);
    event.target.value = ""; // Reset input field
  };

  const handleRemoveFile = () => {
    setFile(null); // Remove the file
  };

  const handleSave = async () => {
    if (!selectedEnrichmentId) return;
    if (!query && !file) {
      setError("Either a file or query_response must be provided.");
      return;
    }
    setLoading(true); // Show spinner
    const formData = new FormData();
    formData.append("payload", response);
    formData.append("enrichment_id", selectedEnrichmentId.enrichment_id);
    if (file) {
      formData.append("file", file); // Only one file
    }

    try {
      const saveResponse = await axios.put(
        `${config.heartieBE}/enrichments/${selectedEnrichmentId.enrichment_id}`,
        formData
      );

      if (saveResponse.status === 200) {
        selectedEnrichmentId.status = "responded";
        setShowSuccess(true);
        setIsSubmitted(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 6000);
      } else {
        console.error("Save failed", saveResponse);
      }
    } catch (error) {
      handleError(
        setError,
        "Either a File or Query Response must be provided."
      );
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  const handleCancel = () => {
    // Go back to ConfigEnrichment.js page
    setCurrentComponent("config-knowledge-enrichment");
  };

  if (!selectedEnrichmentId) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {loading && (
        <div className="knowledge-spinner-overlay">
          <div className="spinner-border mb-2" role="status">
            <span className="sr-only"></span>
          </div>
          <span className="knowledge-loading-text">
            Please wait response is being saved...
          </span>
        </div>
      )}
      {error && (
        <div className="p-3 mb-2 bg-danger" role="alert">
          {error}
        </div>
      )}
      {showSuccess && (
        <div className="p-3 mb-2 bg-success" role="alert">
          Knowledge Enrichment updated successfully!
        </div>
      )}
      <div className={`form-container ${loading ? "blur" : ""}`}>
        <fieldset id="enrichmentDetailsFieldset">
          <legend id="agentDetailsLegend">
            Knowledge Enrichment Request Details
          </legend>
          <hr />
          <div className="top-right-container">
            <div className="view-agent-logs">
              <div className="status">
                <span>Status</span>
                <Badge text={selectedEnrichmentId.status} />
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
                  href="/#"
                  style={{ color: "rgb(45, 182, 212)", fontWeight: "bold" }}
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  upload
                </a>{" "}
                the document containing the response to the query below.
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
              <label>Upload Response Document</label>
              <input
                type="file"
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
              <div className="file-names">
                {file && (
                  <div className="file-item">
                    <span>{file.name}</span>
                    <i
                      className="fa-solid fa-xmark remove-file-btn"
                      onClick={handleRemoveFile}
                    ></i>
                  </div>
                )}
              </div>
            </div>
            <div className="date-row">
              <div className="date-group">
                <label>Request Date</label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="labelValue">
                  {dateFormat(selectedEnrichmentId.requested_on)}
                </div>
              </div>
              <div className="date-group">
                <label className="displayDate">Response Date</label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="labelValue">
                  {selectedEnrichmentId.responded_on
                    ? dateFormat(selectedEnrichmentId.responded_on)
                    : "-"}
                </div>
              </div>
              <div className="date-group">
                <label className="displayDate">Ingested Date</label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="labelValue">
                  {selectedEnrichmentId.ingested_on
                    ? dateFormat(selectedEnrichmentId.ingested_on)
                    : "-"}
                </div>
              </div>
            </div>
            <div className="form-group save-btn-container">
              <label></label>
              <button className="save-btn" onClick={handleSave}>
                {isSubmitted ? "Edit" : "Save"}
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default ConfigKnowledgeEnrichmentDetails;
