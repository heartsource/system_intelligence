import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/knowledgefilterButtonWithPopover.css";
import config from "../../config";
import { capitalizeFirstLetter } from "../../utils/camelCase";

const KnowledgeFilterPopover = ({ isOpen, closePopover, onApply }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [status, setStatus] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.post(
          `${config.heartieBE}/enrichments/fetch`,
          {}
        );
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        const uniqueStatuses = [...new Set(data.map((item) => item.status))];
        const initialCheckedItems = {};
        uniqueStatuses.forEach((status) => {
          initialCheckedItems[status] = false;
        });
        setStatus(uniqueStatuses);
        setCheckedItems(initialCheckedItems);
      } catch (error) {
        console.error("Error fetching Status:", error);
      }
    };

    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const handleCheckboxChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSelectAllChange = (event) => {
    const newCheckedItems = {};
    status.forEach((status) => {
      newCheckedItems[status] = event.target.checked;
    });
    setCheckedItems(newCheckedItems);
  };

  const handlePopoverClick = (event) => {
    //event.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div className="knowledge-popover-container" onClick={handlePopoverClick}>
      <div className="knowledge-popover-content">
        <div>
          <input
            type="checkbox"
            checked={Object.values(checkedItems).every(Boolean)}
            onChange={handleSelectAllChange}
          />
          <label>Select All</label>
        </div>
        {status.map((status, index) => (
          <div key={index}>
            <input
              type="checkbox"
              name={status}
              checked={checkedItems[status] || false}
              onChange={handleCheckboxChange}
            />
            <label>{capitalizeFirstLetter(status)}</label>
          </div>
        ))}
        <button onClick={() => onApply(checkedItems, status)}>Apply</button>
        <button onClick={closePopover}>Cancel</button>
      </div>
    </div>
  );
};

export default KnowledgeFilterPopover;
