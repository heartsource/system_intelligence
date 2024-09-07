import React from "react";

const Badge = ({ text }) => {
  const getBackgroundColor = (text) => {
    switch (text.toLowerCase()) {
      case "ingested":
        return "#28a745"; // Green
      case "inquired":
        return "#dc3545"; // Red
      case "responded":
        return "orange"; // Yellow
      case "response updated":
        return "#007bff"; // Blue
      default:
        return "#fff";
    }
  };

  const badgeStyle = {
    backgroundColor: getBackgroundColor(text),
    color: "#fff",
    padding: "2px 6px", // Adjusted padding to reduce the size
    borderRadius: "8px", // Smaller border radius
    display: "inline-block", // Inline-block to keep it in line
    fontSize: "14px", // Reduced font size to fit better in the table
    fontWeight: "bold",
    textTransform: "capitalize",
    lineHeight: "1.2", // Ensure no extra line-height space is added
    verticalAlign: "middle", // Vertically center the badge within the row
  };

  return <span style={badgeStyle}>{text}</span>;
};

export default Badge;
