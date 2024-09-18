import React from "react";

const Badge = ({ text }) => {
  const getBackgroundColor = (text) => {
    switch (text.toLowerCase()) {
      case "ingested":
        return "#28a745"; // Green
      case "inquired":
        return "#dc3545"; // Red
      case "responded":
        return "darkorange"; // Orange
      case "response updated":
        return "#007bff"; // Blue
      default:
        return "#fff";
    }
  };

  const badgeStyle = {
    backgroundColor: getBackgroundColor(text),
    color: "#fff",
    padding: "2px 10px",
    borderRadius: "8px",
    display: "inline-block",
    fontSize: "13px",
    fontWeight: "bold",
    textTransform: "capitalize",
    lineHeight: "1.2",
    verticalAlign: "middle",
    textAlign: "left",
  };

  return <span style={badgeStyle}>{text}</span>;
};

export default Badge;
