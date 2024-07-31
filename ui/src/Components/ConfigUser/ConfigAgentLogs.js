import React, { useEffect, useState, useContext, useRef } from "react";
import "../../Styles/configAgentLogs.css";
import { sortItems, getSortIcon } from "../../utils/sort";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { handleError } from "../../utils/handleError";
import FilterButtonWithPopover from "./FilterButtonWithPopover";
import config from "../../config";
import Spinner from "../Spinner";

const TableHeader = ({ columns, sortConfig, onSort }) => (
  <div className="logs-grid-header">
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
  <div className="logs-grid-row">
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

const ConfigAgentLogs = () => {
  const listInnerRef = useRef();
  const {
    logs,
    setLogs,
    selectedAgentId,
    filteredLogs,
    setFilteredLogs,
    sortConfig,
    setSortConfig,
    componentKey,
    setCurrentComponent,
    setSelectedAgent,
  } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const [wasLastList, setWasLastList] = useState(false);
  const [loading, setLoading] = useState(false);

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
    { key: "duration", label: "Duration (In Sec)", sortable: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const payload = selectedAgentId ? { agent_ids: [selectedAgentId] } : {};
        const response = await axios.post(`${config.heartieBE}/logs/`, {
          ...payload,
          limit: 10,
          offset: (currPage - 1) * 10,
        });
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        if (data.length === 0) {
          setWasLastList(true);
          return;
        }
        setFilteredLogs((prevLogs) => [...prevLogs, ...data]);
        setLogs((prevLogs) => [
          ...prevLogs,
          ...sortItems(data, sortConfig.key, sortConfig.direction),
        ]);
      } catch (error) {
        handleError(setError, "error");
      } finally {
        setLoading(false);
      }
    };

    if (!wasLastList) {
      fetchData();
    }
  }, [
    currPage,
    selectedAgentId,
    sortConfig.key,
    sortConfig.direction,
    wasLastList,
  ]);

  useEffect(() => {
    setFilteredLogs([]);
    setLogs([]);
    setCurrPage(1);
    setWasLastList(false);
  }, [componentKey]);

  const sortLogs = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    const sortedLogs = sortItems(
      filteredLogs.length > 0 ? filteredLogs : logs,
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
      console.error(error);
    }
  };

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        setCurrPage((prevPage) => prevPage + 1);
      }
    }
  };

  return (
    <>
      <div
        className="agentLogs-fieldset-container"
        id="fieldset-container-logs">
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
            <div
              className="agentlogs-row-container"
              onScroll={onScroll}
              ref={listInnerRef}>
              {loading && <Spinner />}
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
              {logs.length} Logs
            </div>
          </div>
        </fieldset>
      </div>
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Display error */}
    </>
  );
};

export default ConfigAgentLogs;
