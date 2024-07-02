import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/configAgents.css";
import { sortItems, getSortIcon } from "../../utils/sort";
import { closeModal, requestToggleStatus } from "../../utils/modal";
import Table from "../../utils/table"; // Adjust the import path

const columns = [
  { key: "name", label: "Agent Name", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "model", label: "Model", sortable: true },
  { key: "flow", label: "Flow", sortable: true },
  { key: "updated_dt", label: "Updated", sortable: true },
  { key: "created_dt", label: "Created", sortable: true },
  { key: "action", label: "Action", sortable: false }, // Disable sorting for the action column
];

const ConfigAgents = () => {
  const [agents, setAgents] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "updated_dt",
    direction: "desc",
  });
  const [modalInfo, setModalInfo] = useState({
    show: false,
    index: null,
    newStatus: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {};
        const response = await axios.post(
          "http://4.255.69.143/heartie-be/agents/",
          payload
        );
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        const sortedAgents = sortItems(data, "updated_dt", "desc");

        setAgents(sortedAgents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const sortAgents = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key !== key) {
      direction = "desc";
    }

    const sortedAgents = sortItems(agents, key, direction);
    setAgents(sortedAgents);
    setSortConfig({ key, direction });
  };

  const confirmToggleStatus = () => {
    const { index, newStatus } = modalInfo;
    const updatedAgents = agents.map((agent, idx) => {
      if (idx === index) {
        return { ...agent, status: newStatus };
      }
      return agent;
    });
    setAgents(updatedAgents);
    setModalInfo({ show: false, index: null, newStatus: "" });
  };

  const customRenderers = {
    status: (agent) =>
      agent.status === "active" ? (
        <i className="fa-solid fa-circle-check" id="checkGreen"></i>
      ) : (
        <i
          className="fa-solid fa-circle-xmark"
          style={{ color: "#db0f00" }}
        ></i>
      ),
    action: (agent, index) =>
      agent.name !== "Default System Agent" ? (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`flexSwitchCheckDefault${index}`}
            onChange={() => requestToggleStatus(agents, setModalInfo, index)}
            checked={agent.status === "active"}
            data-toggle="tooltip"
            data-placement="top"
            title={agent.status === "active" ? "Disable" : "Enable"}
          />
        </div>
      ) : (
        <span></span>
      ),
  };

  return (
    <>
      <div className="fieldset-container" id="configAgentContainer">
        <fieldset id="configAgents">
          <legend>Agents</legend>
          <hr className="configuration_form" />

          <Table
            data={agents}
            columns={columns}
            sortConfig={sortConfig}
            onSort={sortAgents}
            customRenderers={customRenderers}
          />
          <label id="pagination">
            Showing {agents.length} of {agents.length} Agents
          </label>
        </fieldset>
      </div>

      {modalInfo.show && (
        <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Status Change</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => closeModal(setModalInfo)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to change the status of &quot;
                  {agents[modalInfo.index].name}&quot; to &quot;
                  {modalInfo.newStatus}&quot;?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => closeModal(setModalInfo)}
                >
                  No
                </button>
                <button
                  type="button"
                  id="configYes"
                  className="btn btn-primary"
                  onClick={confirmToggleStatus}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfigAgents;
