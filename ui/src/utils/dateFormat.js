// Date format utility function
export const dateFormat = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour format
  };
  const date = new Date(dateString);
  return date.toLocaleString("en-US", options).replace(",", "");
};
