import React, { useEffect, useState, useContext, useRef } from "react";
import { usePopper } from "react-popper";
import "../../Styles/configKnowledgeEnhancement.css";
import { sortItems, getSortIcon } from "../../utils/sort";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { handleError } from "../../utils/handleError";
import FilterButtonWithPopover from "./FilterButtonWithPopover";
import config from "../../config";
import Spinner from "../Spinner";
import { capitalizeFirstLetter } from "../../utils/camelCase";

const TableHeader = ({ columns, sortConfig, onSort }) => (
  <div className="knowledge-grid-header">
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

const getStatusClass = (status) => {
  switch (status) {
    case "injested":
      return "status-injested";
    case "responded":
      return "status-responded";
    case "inquired":
      return "status-inquired";
    default:
      return "status-default";
  }
};

const TableRow = ({
  agent,
  index,
  columns,
  customRenderers,
  onInteractionIdClick,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverText, setPopoverText] = useState("");
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement);

  const handleMouseOver = (e, text) => {
    setPopoverText(text);
    setShowPopover(true);
  };

  const handleMouseOut = () => {
    setShowPopover(false);
  };

  return (
    <div className="knowledge-grid-row">
      {columns.map((column) => (
        <div
          key={column.key}
          className={`grid-cell ${
            column.key === "status" ? getStatusClass(agent[column.key]) : ""
          }`}
          onClick={() =>
            column.key === "enrichment_id" && onInteractionIdClick(agent)
          }
          onMouseOver={
            column.key === "query"
              ? (e) => handleMouseOver(e, agent[column.key])
              : null
          }
          onMouseOut={column.key === "query" ? handleMouseOut : null}
          ref={column.key === "query" ? setReferenceElement : null}
        >
          {customRenderers && customRenderers[column.key]
            ? customRenderers[column.key](agent, index)
            : column.key === "status"
            ? capitalizeFirstLetter(agent[column.key])
            : agent[column.key]}
        </div>
      ))}
      {showPopover && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="queryPopover"
        >
          {popoverText}
        </div>
      )}
    </div>
  );
};

const ConfigKnowledgeEnhancement = () => {
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
  const [fetchedLogs, setFetchedLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "enrichment_id", label: "Enhancement Id", sortable: true },
    {
      key: "status",
      label: (
        <>
          Status &nbsp;
          <FilterButtonWithPopover />
        </>
      ),
      sortable: true,
    },
    { key: "query", label: "Query", sortable: true },
    { key: "requested_on", label: "Requested On", sortable: true },
    { key: "responded_on", label: "Responded On", sortable: true },
    { key: "injested_on", label: "Ingested On", sortable: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const payload = selectedAgentId ? { agent_ids: [selectedAgentId] } : {};
        const response = await axios.post(
          `${config.heartieBE}/enrichments/fetch`,
          payload
        );
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setFilteredLogs(data);
        setLogs(sortItems(data, sortConfig.key, sortConfig.direction));
      } catch (error) {
        handleError(setError, "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (componentKey) {
      fetchData();
    }
  }, [selectedAgentId, setLogs, componentKey]);

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
      console.error("Error fetching interaction details", error);
    }
  };

  return (
    <div
      className="knowledge-fieldset-container"
      id="fieldset-container-knowledge"
    >
      <fieldset id="knowledgeFieldset">
        <legend id="agentLogs">Knowledge Enhancement Request</legend>
        <hr />
        <div className="knowledge-table-container">
          <TableHeader
            columns={columns}
            sortConfig={sortConfig}
            onSort={sortLogs}
          />
          <div className="knowledge-row-container">
            {loading && <Spinner />}
            {(filteredLogs.length > 0 ? filteredLogs : logs).map(
              (log, index) => (
                <TableRow
                  key={index}
                  agent={log}
                  index={index}
                  columns={columns}
                  customRenderers={null}
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
  );
};

export default ConfigKnowledgeEnhancement;
