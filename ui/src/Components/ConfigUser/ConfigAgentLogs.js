import React, { useEffect, useState, useContext } from "react";
import "../../Styles/configAgentLogs.css";
import { sortItems, getSortIcon } from "../../utils/sort";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { handleError } from "../../utils/handleError";
import FilterButtonWithPopover from "./FilterButtonWithPopover";

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
  const { logs, setLogs, selectedAgentId, filteredLogs } =
    useContext(AppContext);
  const [sortConfig, setSortConfig] = useState({
    key: "interaction_id",
    direction: "desc",
  });
  const [error, setError] = useState(null);
  const [fetchedLogs, setFetchedLogs] = useState([]);

  const columns = [
    { key: "interaction_id", label: "Agent Interaction Id", sortable: true },
    {
      key: "agent_name",
      label: (
        <>
          Agent Name &nbsp;
          {!selectedAgentId && <FilterButtonWithPopover />}
        </>
      ),
      sortable: true,
    },
    { key: "model", label: "Model", sortable: true },
    { key: "flow", label: "Flow", sortable: true },
    { key: "interaction_date", label: "Interaction Date", sortable: true },
    { key: "duration", label: "Duration", sortable: true },
  ];

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
        setFetchedLogs(data);
        setLogs(sortItems(data, sortConfig.key, sortConfig.direction));
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

    const sortedLogs = sortItems(fetchedLogs, key, direction);
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
              {(filteredLogs.length > 0 ? filteredLogs : logs).map(
                (log, index) => (
                  <TableRow
                    key={index}
                    agent={log}
                    index={index}
                    columns={columns}
                  />
                )
              )}
            </div>
            <div id="pagination">
              Showing{" "}
              {filteredLogs.length > 0 ? filteredLogs.length : logs.length} of{" "}
              {logs.length} Logs
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default ConfigAgentLogs;
