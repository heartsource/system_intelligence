import React, { useEffect, useState } from "react";
import "../../Styles/configAgents.css";

const initialAgents = [
  {
    name: "Telecom Support Agent",
    status: "active",
    model: "ChatGPT4",
    flow: "RAG",
    updated: "June 12, 2024 11:35",
    created: "May 12, 2024 18:21",
  },

  {
    name: "Jira Support Agent",
    status: "active",
    model: "Llama 3",
    flow: "Fine Tuning",
    updated: "June 9, 2024 09:44",
    created: "May 12, 2024 18:21",
  },
  {
    name: "ERP Support Agent",
    status: "inactive",
    model: "ChatGPT4",
    flow: "Fine Tuning",
    updated: "June 7, 2024 11:35",
    created: "May 12, 2024 18:21",
  },
  {
    name: "Default System Agent",
    status: "active",
    model: "ChatGPT4",
    flow: "RAG",
    updated: "May 12, 2024 11:35",
    created: "May 12, 2024 07:21",
  },
  {
    name: "Telecom Support Agent",
    status: "active",
    model: "ChatGPT4",
    flow: "RAG",
    updated: "June 12, 2024 11:35",
    created: "May 12, 2024 18:21",
  },
  {
    name: "Jira Support Agent",
    status: "active",
    model: "Llama 3",
    flow: "Fine Tuning",
    updated: "June 9, 2024 09:44",
    created: "May 12, 2024 18:21",
  },
  {
    name: "ERP Support Agent",
    status: "inactive",
    model: "ChatGPT4",
    flow: "Fine Tuning",
    updated: "June 7, 2024 11:35",
    created: "May 12, 2024 18:21",
  },
  {
    name: "Default System Agent",
    status: "active",
    model: "ChatGPT4",
    flow: "RAG",
    updated: "May 12, 2024 11:35",
    created: "May 12, 2024 07:21",
  },
  {
    name: "Agent",
    status: "active",
    model: "ChatGPT4",
    flow: "RAG",
    updated: "May 12, 2024 11:35",
    created: "May 12, 2024 07:21",
  },
  {
    name: "Agent2",
    status: "active",
    model: "ChatGPT4",
    flow: "RAG",
    updated: "May 12, 2024 11:35",
    created: "May 12, 2024 07:21",
  },
];

const ConfigAgents = () => {
  const [agents, setAgents] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "updated",
    direction: "desc",
  });
  const [modalInfo, setModalInfo] = useState({
    show: false,
    index: null,
    newStatus: "",
  });

  useEffect(() => {
    const sortedAgents = [...initialAgents].sort((a, b) => {
      return new Date(b.updated) - new Date(a.updated);
    });
    setAgents(sortedAgents);
  }, []);

  //for sorting

  const sortAgents = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key !== key) {
      direction = "desc";
    }

    const sortedAgents = [...agents].sort((a, b) => {
      if (key === "updated" || key === "created") {
        return direction === "asc"
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      } else {
        if (a[key] < b[key]) {
          return direction === "asc" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      }
    });

    setAgents(sortedAgents);
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        return <i className="bi bi-arrow-up"></i>;
      } else {
        return <i className="bi bi-arrow-down"></i>;
      }
    }
    return <i className="bi bi-arrow-down-up"></i>;
  };

  //for toggling action
  const requestToggleStatus = (index) => {
    const newStatus = agents[index].status === "active" ? "inactive" : "active";
    setModalInfo({ show: true, index, newStatus });
  };

  //for confirming toggle status
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

  //for closing modal
  const closeModal = () => {
    setModalInfo({ show: false, index: null, newStatus: "" });
  };

  return (
    <>
      <div className="fieldset-container">
        <fieldset id="configAgents">
          <legend>Agents</legend>
          <hr className="configuration_form" />
          {/* <div className="d-flex justify-content-end mb-3 search-box">
            <input
              type="text"
              className="form-control w-25"
              placeholder="Search"
              aria-label="Search"
            />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div> */}
          <div class="table-container">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th onClick={() => sortAgents("name")}>
                    Agent Name {getSortIcon("name")}
                  </th>
                  <th onClick={() => sortAgents("status")}>
                    Status {getSortIcon("status")}
                  </th>
                  <th onClick={() => sortAgents("model")}>
                    Model {getSortIcon("model")}
                  </th>
                  <th onClick={() => sortAgents("flow")}>
                    Flow {getSortIcon("flow")}
                  </th>
                  <th onClick={() => sortAgents("updated")}>
                    Updated {getSortIcon("updated")}
                  </th>
                  <th onClick={() => sortAgents("created")}>
                    Created {getSortIcon("created")}
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent, index) => (
                  <tr key={index}>
                    <td>{agent.name}</td>
                    <td>
                      {agent.status === "active" ? (
                        <i
                          className="fa-solid fa-circle-check"
                          id="checkGreen"></i>
                      ) : (
                        <i
                          className="fa-solid fa-circle-xmark"
                          style={{ color: "#db0f00" }}></i>
                      )}
                    </td>
                    <td>{agent.model}</td>
                    <td>{agent.flow}</td>
                    <td>{agent.updated}</td>
                    <td>{agent.created}</td>
                    <td>
                      {agent.name !== "Default System Agent" ? (
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id={`flexSwitchCheckDefault${index}`}
                            onChange={() => requestToggleStatus(index)}
                            checked={agent.status === "active"}
                            data-toggle="tooltip"
                            data-placement="top"
                            title={
                              agent.status === "active" ? "Disable" : "Enable"
                            }
                          />
                        </div>
                      ) : (
                        <span></span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                <button type="button" className="close" onClick={closeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to change the status of &quot;
                  {agents[modalInfo.index].name}&quot; to &quot;
                  {modalInfo.newStatus}&quot; {""}?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}>
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={confirmToggleStatus}>
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
