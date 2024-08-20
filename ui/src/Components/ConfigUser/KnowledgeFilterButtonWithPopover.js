import React, { useState, useRef, useContext, useEffect } from "react";
import { usePopper } from "react-popper";
import axios from "axios";
import KnowledgeFilterPopover from "./KnowledgeFilterPopover";
import { AppContext } from "../../context/AppContext";
import "../../Styles/knowledgefilterButtonWithPopover.css";
import { sortItems } from "../../utils/sort";
import config from "../../config";

const KnowledgeFilterButtonWithPopover = () => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);
  const { setFilteredLogs, sortConfig } = useContext(AppContext);

  const { styles, attributes, update } = usePopper(
    buttonRef.current,
    popoverRef.current,
    {
      placement: "bottom-start",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 4],
          },
        },
      ],
    }
  );

  useEffect(() => {
    if (isPopoverOpen && update) {
      update();
    }
  }, [isPopoverOpen, update]);

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

      {isPopoverOpen && (
        <div
          ref={popoverRef}
          style={styles.popper}
          {...attributes.popper}
          className="knowledge-popover-container-parent"
        >
          <KnowledgeFilterPopover
            isOpen={isPopoverOpen}
            closePopover={closePopover}
            onApply={handleApply}
          />
        </div>
      )}
    </>
  );
};

export default KnowledgeFilterButtonWithPopover;
