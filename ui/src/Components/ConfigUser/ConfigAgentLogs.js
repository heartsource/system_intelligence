import React, { useState } from "react";
import "../../Styles/configAgentLogs.css";
import { sortItems } from "../../utils/sort";
import Table from "../../utils/table";

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
];

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
      <div className="fieldset-container" id="fieldset-container-logs">
        <fieldset id="agentLogsFieldset">
          <legend>Agent Logs</legend>
          <hr className="configuration_form" />
          <div className="logs-table-container table-responsive" id="agentLogs">
            <Table
              data={logs}
              columns={columns}
              sortConfig={sortConfig}
              onSort={sortLogs}
            />
          </div>
          <label id="pagination">Showing 2 of 4 Agents</label>
        </fieldset>
      </div>
    </>
  );
};

export default ConfigAgentLogs;
