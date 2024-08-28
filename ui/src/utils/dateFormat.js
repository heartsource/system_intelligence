export const dateFormat = (dateString) => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);
  if (isNaN(date)) {
    return "-";
  }

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleString(undefined, options);
  return formattedDate;
};
