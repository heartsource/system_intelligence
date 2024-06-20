import React, { useState } from "react";
import axios from "axios";
import "../../Styles/configFileUpload.css";

const ConfigFileUpload = () => {
  const [files, setFiles] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileCount, setFileCount] = useState(0);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
    setErrorMessage("");
    setSuccessMessage("");
    setFileCount(selectedFiles.length);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setErrorMessage("Please select at least one file for upload.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    setShowModal(true);
    try {
      const response = await axios.post(
        "http://4.255.69.143/heartie-be/load_file_to_chromadb/",
        formData,
        {
          headers: {
            accept: "application/json",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      setSuccessMessage("Files uploaded successfully.");
      setShowModal(false);
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          `Error: ${error.response.data.message || "Unknown error occurred."}`
        );
      } else if (error.request) {
        setErrorMessage("Error: No response received from the server.");
      } else {
        setErrorMessage(`Error: ${error.message}`);
      }
      setShowModal(false);
    }

    setUploadProgress(100);
    setFileCount(0);
    setFiles(null);
  };

  const getFileIcon = (extension) => {
    switch (extension.toLowerCase()) {
      case "pdf":
        return (
          <i className="fa-solid fa-file-pdf" style={{ color: "#db061b" }}></i>
        );
      case "doc":
      case "docx":
        return (
          <i className="fa-solid fa-file-word" style={{ color: "#2b56a1" }}></i>
        );
      case "txt":
        return (
          <i className="fa-solid fa-file-alt" style={{ color: "#7589ae" }}></i>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <i
            className="fa-solid fa-file-image"
            style={{ color: "#16a777" }}></i>
        );
      default:
        return (
          <i className="fa-solid fa-file" style={{ color: "#6bcad6" }}></i>
        );
    }
  };

  return (
    <>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
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
              <label htmlFor="fileID">
                Files Supported: PDF, TEXT, DOC, DOCX, IMAGES
              </label>
            </p>

            {files && fileCount > 0 && <h3>{fileCount} file(s) selected</h3>}
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
              {files ? files.length : 0} file(s)
            </h3>

            <ul style={{ listStyle: "none" }}>
              {files instanceof FileList &&
                Array.from(files).map((file, index) => (
                  <li key={index} style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "10px" }}>
                        {" "}
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
