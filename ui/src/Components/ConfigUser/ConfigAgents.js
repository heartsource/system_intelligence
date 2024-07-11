import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/configAgents.css";
import { sortItems, getSortIcon } from "../../utils/sort";
import { closeModal, requestToggleStatus } from "../../utils/modal";
import { capitalizeFirstLetter } from "../../utils/camelCase";

const columns = [
  { key: "name", label: "Agent Name", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "model", label: "Model", sortable: true },
  { key: "flow", label: "Flow", sortable: true },
  { key: "updated_dt", label: "Updated", sortable: true },
  { key: "created_dt", label: "Created", sortable: true },
  { key: "action", label: "Action", sortable: false },
];

const TableHeader = ({ columns, sortConfig, onSort }) => (
  <div className="grid-header">
    {columns.map((column) => (
      <div
        key={column.key}
        className={`grid-cell ${column.sortable ? "sortable" : ""}`}
        onClick={() => column.sortable && onSort(column.key)}
      >
        {column.label} {column.sortable && getSortIcon(column.key, sortConfig)}
      </div>
    ))}
  </div>
);

const TableRow = ({ agent, index, columns, customRenderers }) => (
  <div className="grid-row">
    {columns.map((column) => (
      <div key={column.key} className="grid-cell">
        {customRenderers && customRenderers[column.key]
          ? customRenderers[column.key](agent, index)
          : agent[column.key]}
      </div>
    ))}
  </div>
);

const ConfigAgents = () => {
  const [agents, setAgents] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "created_dt",
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
        const sortedAgents = sortItems(data, "created_dt", "desc");

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

  const updateAgentStatus = async (index, newStatus) => {
    try {
      const agentToUpdate = agents[index];
      const response = await axios.put(
        `http://4.255.69.143/heartie-be/agents/${agentToUpdate.id}`,
        { ...agentToUpdate, status: newStatus }
      );

      if (response.status === 200) {
        const updatedAgents = agents.map((agent, idx) => {
          if (idx === index) {
            return { ...agent, status: newStatus };
          }
          return agent;
        });
        setAgents(updatedAgents);
        setModalInfo({ show: false, index: null, newStatus: "" });
      } else {
        console.error("Error updating status:", response);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const confirmToggleStatus = () => {
    const { index, newStatus } = modalInfo;
    updateAgentStatus(index, newStatus);
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
      <div className="agent-fieldset-container" id="configAgentContainer">
        <fieldset id="configAgents">
          <legend id="agentListLengend">
            Agents <i class="fas fa-users"></i>
          </legend>
          <hr />
          <div className="agent-table-container">
            <TableHeader
              columns={columns}
              sortConfig={sortConfig}
              onSort={sortAgents}
            />
            <div className="row-container">
              {agents.map((agent, index) => (
                <TableRow
                  key={index}
                  agent={agent}
                  index={index}
                  columns={columns}
                  customRenderers={customRenderers}
                />
              ))}
            </div>
            <div id="pagination">
              Showing {agents.length} of {agents.length} Agents
            </div>
          </div>
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
                  {modalInfo.newStatus
                    ? capitalizeFirstLetter(modalInfo.newStatus)
                    : ""}
                  &quot;?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  id="configNo"
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
