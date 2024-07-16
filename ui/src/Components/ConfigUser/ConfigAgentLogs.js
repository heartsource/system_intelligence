import React, { useEffect, useState, useContext } from "react";
import "../../Styles/configAgentLogs.css";
import { sortItems, getSortIcon } from "../../utils/sort";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { handleError } from "../../utils/handleError";

const columns = [
  { key: "interaction_id", label: "Agent Interaction Id", sortable: true },
  {
    key: "agent_name",
    label: (
      <>
        Agent Name<i className="fa fa-filter" aria-hidden="true"></i>
      </>
    ),
    sortable: true,
  },
  { key: "interaction_date", label: "Interaction Date", sortable: true },
  { key: "duration", label: "Duration", sortable: true },
];

const TableHeader = ({ columns, sortConfig, onSort }) => (
  <div className="logs-grid-header">
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
  <div className="logs-grid-row">
    {columns.map((column) => (
      <div key={column.key} className="grid-cell">
        {customRenderers && customRenderers[column.key]
          ? customRenderers[column.key](agent, index)
          : agent[column.key]}
      </div>
    ))}
  </div>
);

const ConfigAgentLogs = () => {
  const { logs, setLogs, selectedAgentId } = useContext(AppContext);
  const [sortConfig, setSortConfig] = useState({
    key: "updated",
    direction: "desc",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = selectedAgentId ? { agent_ids: [selectedAgentId] } : {};
        const response = await axios.post(
          "http://4.255.69.143/heartie-be/logs/",
          payload
        );
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        const sortedLogs = sortItems(data, "created_dt", "desc");
        setLogs(sortedLogs);
      } catch (error) {
        handleError(setError, "error");
      }
    };
    fetchData();
  }, [selectedAgentId, setLogs]);

  const sortLogs = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key !== key) {
      direction = "desc";
    }

    const sortedLogs = sortItems(logs, key, direction);
    setLogs(sortedLogs);
    setSortConfig({ key, direction });
  };

  return (
    <>
      <div
        className="agentLogs-fieldset-container"
        id="fieldset-container-logs"
      >
        <fieldset id="agentLogsFieldset">
          <legend id="agentLogs">
            Agent Logs <i className="fa-solid fa-headset"></i>
          </legend>
          <hr />
          <div className="agentlogs-table-container">
            <TableHeader
              columns={columns}
              sortConfig={sortConfig}
              onSort={sortLogs}
            />
            <div className="agentlogs-row-container">
              {logs.map((log, index) => (
                <TableRow
                  key={index}
                  agent={log}
                  index={index}
                  columns={columns}
                />
              ))}
            </div>
            <div id="pagination">
              Showing {logs.length} of {logs.length} Agents
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default ConfigAgentLogs;
