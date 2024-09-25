import React, { useState } from "react";
import axios from "axios";
import "../../Styles/configFileUpload.css";
import { handleError } from "../../utils/handleError";
import config from "../../config";

const ConfigFileUpload = () => {
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  const allowedFileTypes = ["pdf", "txt"];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const fileExtension = selectedFile?.name.split(".").pop().toLowerCase();

    if (selectedFile && allowedFileTypes.includes(fileExtension)) {
      setFile(selectedFile);
      setValidationError("");
      setError("");
      setSuccessMessage("");
    } else {
      setValidationError(
        `Invalid file type. Only PDF and TEXT files are allowed.`
      );
      setTimeout(() => {
        setValidationError("");
      }, 6000);
      event.target.value = "";
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      handleError(setError, "Please select a valid file for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setShowModal(true);
    try {
      const response = await axios.post(
        `${config.heartieBE}/load_file_to_chromadb/`,
        formData,
        {
          headers: { accept: "application/json" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      setSuccessMessage("File uploaded successfully.");
      setTimeout(() => setSuccessMessage(""), 6000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "File size is too large.";
      handleError(setError, errorMessage);
    } finally {
      setShowModal(false);
      setUploadProgress(100);
      setFile(null);
      document.getElementById("fileID").value = "";
    }
  };

  const getFileIcon = (extension) => {
    const iconStyles = { color: "" };
    switch (extension.toLowerCase()) {
      case "pdf":
        iconStyles.color = "#db061b";
        return <i className="fa-solid fa-file-pdf" style={iconStyles}></i>;
      case "txt":
        iconStyles.color = "#7589ae";
        return <i className="fa-solid fa-file-alt" style={iconStyles}></i>;
      default:
        iconStyles.color = "#6bcad6";
        return <i className="fa-solid fa-file" style={iconStyles}></i>;
    }
  };

  return (
    <>
      {validationError && (
        <div className="p-3 mb-2 bg-danger">{validationError}</div>
      )}
      {error && <div className="p-3 mb-2 bg-danger">{error}</div>}
      {successMessage && (
        <div className="p-3 mb-2 bg-success">{successMessage}</div>
      )}

      <div className="fieldset-container-fileUpload">
        <fieldset id="fileUploadFieldset">
          <legend>Upload Knowledge Documents</legend>
          <hr />
          <div className="drop_box_fileUpload">
            <header>
              <label htmlFor="fileID">
                <h3>
                  Select File here &nbsp;
                  <i className="fa-solid fa-file-circle-plus fa-bounce"></i>
                </h3>
              </label>
            </header>
            <p>
              <label htmlFor="fileID">Files Supported: PDF, TEXT</label>
            </p>
            {file && <h3>1 file selected</h3>}
            <input
              type="file"
              id="fileID"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button className="btn" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </fieldset>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h3>{uploadProgress < 100 ? "Uploading..." : "Uploaded"} 1 file</h3>
            <div className="progress-bar-container"></div>
            {file && (
              <ul style={{ listStyle: "none" }}>
                <li style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ marginRight: "10px" }}>
                      {getFileIcon(file.name.split(".").pop())}
                    </div>
                    <div
                      style={{
                        flex: "1",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        marginRight: "10px",
                      }}
                    >
                      {file.name}
                    </div>
                    {uploadProgress}%
                    <div>
                      {uploadProgress < 100 ? (
                        <i
                          className="fa-solid fa-spinner"
                          style={{ color: "black" }}
                        ></i>
                      ) : (
                        <i
                          className="fa-solid fa-circle-check"
                          id="successGreen"
                        ></i>
                      )}
                    </div>
                  </div>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ConfigFileUpload;
