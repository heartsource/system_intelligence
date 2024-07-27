import React, { useEffect, useState, useContext } from "react";
import "../../Styles/configKnowledgeEnhancement.css";
import { sortItems, getSortIcon } from "../../utils/sort";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { handleError } from "../../utils/handleError";
import FilterButtonWithPopover from "./FilterButtonWithPopover";
import config from "../../config";

const TableHeader = ({ columns, sortConfig, onSort }) => (
  <div className="knowledge-grid-header">
    {columns.map((column) => (
      <div
        key={column.key}
        className={`grid-cell ${column.sortable ? "sortable" : ""}`}
        onClick={() => column.sortable && onSort(column.key)}>
        {column.label} {column.sortable && getSortIcon(column.key, sortConfig)}
      </div>
    ))}
  </div>
);

const TableRow = ({
  agent,
  index,
  columns,
  customRenderers,
  onInteractionIdClick,
}) => (
  <div className="knowledge-grid-row">
    {columns.map((column) => (
      <div
        key={column.key}
        className="grid-cell"
        onClick={() =>
          column.key === "interaction_id" && onInteractionIdClick(agent)
        }>
        {customRenderers && customRenderers[column.key]
          ? customRenderers[column.key](agent, index)
          : agent[column.key]}
      </div>
    ))}
  </div>
);

const ConfigKnowledgeEnhancement = () => {
  const {
    logs,
    setLogs,
    selectedAgentId,
    filteredLogs,
    setFilteredLogs,
    sortConfig,
    setSortConfig,
    componentKey, // Access the componentKey from context
    setCurrentComponent,
    setSelectedAgent,
  } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [fetchedLogs, setFetchedLogs] = useState([]);

  const columns = [
    { key: "interaction_id", label: "Enhancement Id", sortable: true },
    {
      key: "agent_name",
      label: (
        <>
          Status &nbsp;
          {!selectedAgentId && <FilterButtonWithPopover />}
        </>
      ),
      sortable: true,
    },
    { key: "model", label: "Query", sortable: true },
    { key: "flow", label: "Requested On", sortable: true },
    { key: "interaction_date", label: "Responded On", sortable: true },
    { key: "duration", label: "Ingested On", sortable: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = selectedAgentId ? { agent_ids: [selectedAgentId] } : {};
        const response = await axios.post(`${config.heartieBE}/logs/`, payload);
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setFilteredLogs(data);
        setLogs(sortItems(data, sortConfig.key, sortConfig.direction));
      } catch (error) {
        handleError(setError, "error");
      }
    };
    fetchData();
  }, [selectedAgentId, setLogs, componentKey]); // Add componentKey to dependencies

  const sortLogs = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key !== key) {
      direction = "desc";
    }

    const sortedLogs = sortItems(
      filteredLogs.length > 0 ? filteredLogs : fetchedLogs,
      key,
      direction
    );
    setLogs(sortedLogs);
    setSortConfig({ key, direction });
  };

  const handleInteractionIdClick = async (agent) => {
    try {
      const response = await axios.get(
        `${config.heartieBE}/logs/${agent.interaction_id}`
      );
      const data = response.data.data;
      setSelectedAgent(data);
      setCurrentComponent("agent-log-details");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="knowledge-fieldset-container"
        id="fieldset-container-knowledge">
        <fieldset id="knowledgeFieldset">
          <legend id="agentLogs">Knowledge Enhancement Request </legend>
          <hr />
          <div className="knowledge-table-container">
            <TableHeader
              columns={columns}
              sortConfig={sortConfig}
              onSort={sortLogs}
            />
            <div className="knowledge-row-container">
              {(filteredLogs.length > 0 ? filteredLogs : logs).map(
                (log, index) => (
                  <TableRow
                    key={index}
                    agent={log}
                    index={index}
                    columns={columns}
                    onInteractionIdClick={handleInteractionIdClick}
                  />
                )
              )}
            </div>
            <div id="pagination">
              Showing{" "}
              {filteredLogs.length > 0 ? filteredLogs.length : logs.length} of{" "}
              {logs.length} Records
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default ConfigKnowledgeEnhancement;
