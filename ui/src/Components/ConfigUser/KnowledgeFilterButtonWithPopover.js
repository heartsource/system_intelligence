import React, { useState, useRef, useContext } from "react";
import { usePopper } from "react-popper";
import { createPopper } from "@popperjs/core";
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
  const { setFilteredStatus, sortConfig } = useContext(AppContext);

  const { styles, attributes } = usePopper(
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

  const togglePopover = (e) => {
    e.stopPropagation();
    setPopoverOpen(!isPopoverOpen);
    if (!isPopoverOpen) {
      createPopper(buttonRef.current, popoverRef.current, {
        placement: "bottom-start",
      });
    }
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  const handleApply = async (checkedItems) => {
    closePopover();
    const selectedStatuses = Object.keys(checkedItems).filter(
      (key) => checkedItems[key] === true
    );
    try {
      const response = await axios.post(
        `${config.heartieBE}/enrichments/fetch`,
        {
          status: selectedStatuses,
        }
      );

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      const sortedData = sortItems(data, sortConfig.key, sortConfig.direction);
      setFilteredStatus(sortedData);
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
