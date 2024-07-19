import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/filterButtonWithPopover.css";

const FilterPopover = ({ isOpen, closePopover, onApply }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgentNames = async () => {
      try {
        const response = await axios.post(
          "http://4.255.69.143/heartie-be/agents/",
          {}
        );
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        const initialCheckedItems = {};
        data.forEach((agent) => {
          initialCheckedItems[agent.name] = false;
        });
        setAgents(data);
        setCheckedItems(initialCheckedItems);
      } catch (error) {
        console.error("Error fetching agent names:", error);
      }
    };

    if (isOpen) {
      fetchAgentNames();
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
    agents.forEach((agent) => {
      newCheckedItems[agent.name] = event.target.checked;
    });
    setCheckedItems(newCheckedItems);
  };

  const handlePopoverClick = (event) => {
    event.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div className="popover-container" onClick={handlePopoverClick}>
      <div className="popover-content">
        <div>
          <input
            type="checkbox"
            checked={Object.values(checkedItems).every(Boolean)}
            onChange={handleSelectAllChange}
          />
          <label>Select All</label>
        </div>
        {agents.map((agent) => (
          <div key={agent.id}>
            <input
              type="checkbox"
              name={agent.name}
              checked={checkedItems[agent.name] || false}
              onChange={handleCheckboxChange}
            />
            <label>{agent.name}</label>
          </div>
        ))}
        <button onClick={() => onApply(checkedItems, agents)}>Apply</button>
        <button onClick={closePopover}>Cancel</button>
      </div>
    </div>
  );
};

export default FilterPopover;
