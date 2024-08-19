import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/knowledgefilterButtonWithPopover.css";
import config from "../../config";
import { capitalizeFirstLetter } from "../../utils/camelCase";

const FilterPopover = ({ isOpen, closePopover, onApply }) => {
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
        const initialCheckedItems = {};
        data.forEach((status) => {
          initialCheckedItems[status.status] = false;
        });
        setStatus(data);
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
    event.stopPropagation();
    event.preventDefault();
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSelectAllChange = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const newCheckedItems = {};
    status.forEach((agent) => {
      newCheckedItems[agent.status] = event.target.checked;
    });
    setCheckedItems(newCheckedItems);
  };

  const handlePopoverClick = (event) => {
    event.stopPropagation();
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
        {status.map((agent) => (
          <div key={agent.id}>
            <input
              type="checkbox"
              name={agent.status}
              checked={checkedItems[agent.status] || false}
              onChange={handleCheckboxChange}
            />
            <label>{capitalizeFirstLetter(agent.status)}</label>
          </div>
        ))}
        <button onClick={() => onApply(checkedItems, status)}>Apply</button>
        <button onClick={closePopover}>Cancel</button>
      </div>
    </div>
  );
};

export default FilterPopover;
