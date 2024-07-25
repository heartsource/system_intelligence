import React, { useState } from "react";
import axios from "axios";
import "../../Styles/configFileUpload.css";
import { handleError } from "../../utils/handleError";

const ConfigFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [fileCount, setFileCount] = useState(0);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    setError("");
    setSuccessMessage("");
    setFileCount(selectedFiles.length);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      handleError(setError, "Please select at least one file for upload.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    setShowModal(true);
    try {
      const response = await axios.post(
        "http://4.255.69.143/heartie-be/load_file_to_chromadb/",
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
      setSuccessMessage(
        files.length > 1
          ? "Files uploaded successfully."
          : "File uploaded successfully."
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Unknown error occurred.";
      handleError(setError, errorMessage);
    } finally {
      setShowModal(false);
      setUploadProgress(100);
      setFiles([]);
      setFileCount(0);
    }
  };

  const getFileIcon = (extension) => {
    const iconStyles = { color: "" };
    switch (extension.toLowerCase()) {
      case "pdf":
        iconStyles.color = "#db061b";
        return <i className="fa-solid fa-file-pdf" style={iconStyles}></i>;
      case "doc":
      case "docx":
        iconStyles.color = "#2b56a1";
        return <i className="fa-solid fa-file-word" style={iconStyles}></i>;
      case "txt":
        iconStyles.color = "#7589ae";
        return <i className="fa-solid fa-file-alt" style={iconStyles}></i>;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        iconStyles.color = "#16a777";
        return <i className="fa-solid fa-file-image" style={iconStyles}></i>;
      default:
        iconStyles.color = "#6bcad6";
        return <i className="fa-solid fa-file" style={iconStyles}></i>;
    }
  };

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div className="fieldset-container-fileUpload">
        <fieldset id="fileUploadFieldset">
          <legend>Upload Knowledge Documents</legend>
          <hr className="configuration_form" />
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
            {files.length > 0 && <h3>{fileCount} file(s) selected</h3>}
            <input
              type="file"
              multiple
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
            <h3>
              {uploadProgress < 100 ? "Uploading..." : "Uploaded"}{" "}
              {files.length} file(s)
            </h3>
            <ul style={{ listStyle: "none" }}>
              {files.map((file, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
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
                      }}>
                      {file.name}
                    </div>
                    <div>
                      {uploadProgress < 100 ? (
                        <i
                          className="fa-solid fa-spinner"
                          style={{ color: "black" }}></i>
                      ) : (
                        <i
                          className="fa-solid fa-circle-check"
                          id="checkGreen"></i>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfigFileUpload;
