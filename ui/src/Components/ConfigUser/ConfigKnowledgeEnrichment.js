import React, { useEffect, useState, useContext, useRef } from "react";
import { usePopper } from "react-popper";
import "../../Styles/configKnowledgeEnhancement.css";
import { sortItems, getSortIcon } from "../../utils/sort";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { handleError } from "../../utils/handleError";
import KnowledgeFilterButtonWithPopover from "./KnowledgeFilterButtonWithPopover";
import config from "../../config";
import Spinner from "../Spinner";
import { dateFormat } from "../../utils/dateFormat";
import Badge from "../Badge";

const TableHeader = ({ columns, sortConfig, onSort }) => (
  <div className="knowledge-grid-header">
    {columns.map((column) => (
      <div
        key={column.key}
        className={`knowledge-grid-cell ${column.sortable ? "sortable" : ""}`}
      >
        {column.label}{" "}
        {column.sortable && (
          <span onClick={() => onSort(column.key)}>
            {getSortIcon(column.key, sortConfig)}
          </span>
        )}
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
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverText, setPopoverText] = useState("");
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
    modifiers: [{ name: "offset", options: { offset: [0, 4] } }],
  });

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
          className="knowledge-grid-cell"
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
          {customRenderers && customRenderers[column.key] ? (
            customRenderers[column.key](agent, index)
          ) : column.key === "status" ? (
            <Badge text={agent[column.key]} />
          ) : column.key === "requested_on" ||
            column.key === "responded_on" ||
            column.key === "ingested_on" ? (
            dateFormat(agent[column.key])
          ) : (
            agent[column.key]
          )}
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

const ConfigKnowledgeEnrichment = () => {
  const listInnerRef = useRef();
  const {
    records,
    setRecords,
    selectedEnrichmentId,
    filteredStatus,
    setFilteredStatus,
    totalRecords,
    setTotalRecords,
    sortConfig,
    setSortConfig,
    componentKey,
    setCurrentComponent,
    setSelectedEnrichmentId,
  } = useContext(AppContext);

  const [error, setError] = useState(null);
  const [fetchedStatus, setFetchedStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [wasLastList, setWasLastList] = useState(false);

  const limit = 20;
  const columns = [
    { key: "enrichment_id", label: "Enrichment Id", sortable: true },
    {
      key: "status",
      label: (
        <>
          Status &nbsp;
          <KnowledgeFilterButtonWithPopover />
        </>
      ),
      sortable: true,
    },
    { key: "query", label: "Query", sortable: true },
    { key: "requested_on", label: "Requested On", sortable: true },
    { key: "responded_on", label: "Responded On", sortable: true },
    { key: "ingested_on", label: "Ingested On", sortable: true },
  ];

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight &&
        !loading &&
        !wasLastList
      ) {
        setCurrPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (loading || wasLastList) return;
      setLoading(true);

      try {
        const payload = selectedEnrichmentId
          ? { enrichment_id: [selectedEnrichmentId] }
          : {};

        const response = await axios.post(
          `${config.heartieBE}/enrichments/fetch`,
          {
            ...payload,
            limit,
            offset: (currPage - 1) * limit,
          }
        );

        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        if (data.length === 0) {
          setWasLastList(true);
          return;
        }

        if (currPage === 1) {
          setFilteredStatus(data);
          setRecords(sortItems(data, sortConfig.key, sortConfig.direction));
        } else {
          setFilteredStatus((prevLogs) => [...prevLogs, ...data]);
          setRecords((prevLogs) => [
            ...prevLogs,
            ...sortItems(data, sortConfig.key, sortConfig.direction),
          ]);
        }
        setTotalRecords(response.data.totalRecords);
      } catch (error) {
        handleError(setError, "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currPage, sortConfig.key, sortConfig.direction]);

  useEffect(() => {
    setFilteredStatus([]);
    setRecords([]);
    setCurrPage(1);
    setWasLastList(false);
  }, [componentKey]);

  const sortLogs = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key !== key) {
      direction = "desc";
    }

    const sortedLogs = sortItems(
      filteredStatus.length > 0 ? filteredStatus : fetchedStatus,
      key,
      direction
    );
    setRecords(sortedLogs);
    setSortConfig({ key, direction });
  };

  const handleInteractionIdClick = async (agent) => {
    try {
      const response = await axios.get(
        `${config.heartieBE}/enrichments/${agent.enrichment_id}`
      );
      const data = response.data.data;
      setSelectedEnrichmentId(data);
      setCurrentComponent("knowledge-details");
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
        <legend id="agentLogs">Knowledge Enrichment Requests</legend>
        <hr />
        <div className="knowledge-table-container">
          <TableHeader
            columns={columns}
            sortConfig={sortConfig}
            onSort={sortLogs}
          />
          <div
            className="knowledge-row-container"
            onScroll={onScroll}
            ref={listInnerRef}
          >
            {loading && <Spinner />}
            {(filteredStatus.length > 0 ? filteredStatus : records).map(
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
            {filteredStatus.length > 0 ? filteredStatus.length : records.length}{" "}
            of {totalRecords} Records
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default ConfigKnowledgeEnrichment;
