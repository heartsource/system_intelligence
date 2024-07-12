import React, { useState } from "react";
import "../../Styles/configKnowledgeEnhancement.css";
import { sortItems } from "../../utils/sort";
import Table from "../../utils/table";
const initialKnowledge = [
  {
    enhancementId: 990,
    status: "Inquired",
    query: "How does Jeera...",
    requestedOn: "June 12,2024 11:35",
    respondedOn: "June 12,2024 11:35",
    ingestedOn: "June 8,2024 9:35",
  },
  {
    enhancementId: 1050,
    status: "responded",
    query: "Please help...",
    requestedOn: "June 9,2024 11:35",
    respondedOn: "June 12,2024 11:35",
    ingestedOn: "June 8,2024 9:35",
  },
  {
    enhancementId: 800,
    status: "Ingested",
    query: "What is the...",
    requestedOn: "June 7,2024 11:35",
    respondedOn: "June 12,2024 11:35",
    ingestedOn: "June 8,2024 9:35",
  },
];
const columns = [
  {
    key: "enhancementId",
    label: "Enhancement Id",
    sortable: true,
  },
  {
    key: "status",
    label: (
      <>
        Status<i className="fa fa-filter" aria-hidden="true"></i>
      </>
    ),
    sortable: true,
  },
  {
    key: "query",
    label: "Query",
    sortable: true,
  },
  {
    key: "requestedOn",
    label: "Requested On",
    sortable: true,
  },
  {
    key: "respondedOn",
    label: "Responded On",
    sortable: true,
  },
  {
    key: "ingestedOn",
    label: "Ingested On",
    sortable: true,
  },
];
const ConfigKnowledgeEnhancement = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    description: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };
  const [knowledge, setKnowledge] = useState(initialKnowledge);
  const [sortConfig, setSortConfig] = useState({
    key: "updated",
    direction: "desc",
  });
  const sortedKnowledge = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key !== key) {
      direction = "desc";
    }

    const sortedKnowledge = sortItems(knowledge, key, direction);
    setKnowledge(sortedKnowledge);
    setSortConfig({ key, direction });
  };
  return (
    <>
      <div style={{ color: "white", marginTop: "2em" }}>
        knowledge Enhancement
      </div>
    </>
  );
};

export default ConfigKnowledgeEnhancement;
