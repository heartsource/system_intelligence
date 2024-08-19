import React, { useState, useRef, useContext } from "react";
import { usePopper } from "react-popper";
import axios from "axios";
import KnowledgeFilterPopover from "./KnowledgeFilterPopover";
import { AppContext } from "../../context/AppContext";
import "../../Styles/knowledgefilterButtonWithPopover.css";
import { sortItems } from "../../utils/sort";
import config from "../../config";

const FilterButtonWithPopover = () => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);
  const { setFilteredLogs, sortConfig } = useContext(AppContext);

  const { styles, attributes } = usePopper(
    buttonRef.current,
    popoverRef.current,
    {
      placement: "bottom",
    }
  );

  const togglePopover = (e) => {
    e.stopPropagation();
    setPopoverOpen((prev) => !prev);
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  const handleApply = async (checkedItems, agents) => {
    closePopover();
    const selectedAgentNames = Object.keys(checkedItems).filter(
      (name) => checkedItems[name]
    );
    const selectedAgentIds = agents
      .filter((agent) => selectedAgentNames.includes(agent.status))
      .map((agent) => agent._id);

    try {
      const response = await axios.post(
        `${config.heartieBE}/enrichments/fetch`,
        {
          agent_ids: selectedAgentIds,
        }
      );
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      const sortedData = sortItems(data, sortConfig.key, sortConfig.direction);
      setFilteredLogs(data);
    } catch (error) {
      console.error("Error fetching Status:", error);
    }
  };

  return (
    <>
      <i
        className="fa fa-filter"
        aria-hidden="true"
        ref={buttonRef}
        onClick={togglePopover}
      ></i>

      <div ref={popoverRef} style={styles.popper} {...attributes.popper}>
        <KnowledgeFilterPopover
          isOpen={isPopoverOpen}
          closePopover={closePopover}
          onApply={handleApply}
        />
      </div>
    </>
  );
};

export default FilterButtonWithPopover;
