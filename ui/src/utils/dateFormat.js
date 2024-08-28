export const dateFormat = (dateString) => {
  if (!dateString) {
    return "-";
  }

  // Parse the date string as a UTC date
  const date = new Date(dateString + "Z");
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
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  // Convert the UTC date to the local timezone
  const formattedDate = date.toLocaleString(undefined, options);
  return formattedDate;
};
