import React, { useState } from "react";
import "../../Styles/configAgentLogs.css";
import { sortItems, getSortIcon } from "../../utils/sort";

const columns = [
  { key: "agentInteractionId", label: "Agent Interaction Id", sortable: true },
  {
    key: "agentName",
    label: (
      <>
        Agent Name<i className="fa fa-filter" aria-hidden="true"></i>
      </>
    ),
    sortable: true,
  },
  { key: "interactionDate", label: "Interaction Date", sortable: true },
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

const initialLogs = [
  {
    agentInteractionId: "id0980326454wifg",
    agentName: "Default System Agent",
    interactionDate: "June 12, 2024 11:35",
    duration: "29 seconds",
  },
  {
    agentInteractionId: "id0985544444wifg",
    agentName: "Telecom Support Agent",
    interactionDate: "June 9, 2024 09:44",
    duration: "902 seconds",
  },
  {
    agentInteractionId: "id0980326454wifg",
    agentName: "Default System Agent",
    interactionDate: "June 12, 2024 11:35",
    duration: "29 seconds",
  },
  {
    agentInteractionId: "id0985544444wifg",
    agentName: "Telecom Support Agent",
    interactionDate: "June 9, 2024 09:44",
    duration: "902 seconds",
  },
];

const ConfigAgentLogs = () => {
  const [logs, setLogs] = useState(initialLogs);
  const [sortConfig, setSortConfig] = useState({
    key: "updated",
    direction: "desc",
  });

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
            Agent Logs <i class="fa-solid fa-headset"></i>
          </legend>
          <hr />
          <div className="agentlogs-table-container">
            <TableHeader
              columns={columns}
              sortConfig={sortConfig}
              onSort={sortLogs}
            />
            <div className="agentlogs-row-container">
              {logs.map((agent, index) => (
                <TableRow
                  key={index}
                  agent={agent}
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
