/**
 * Generic sort function to sort an array of objects based on a given key and direction.
 * @param {Array} items- Array of objects to be sorted.
 * @param {String} key - Key to sort by.
 * @param {String} direction - Sort direction: 'asc' or 'desc'.
 * @returns {Array} - sorted array.
 */

export const sortItems = (items, key, direction = "asc") => {
  // Ensure items is an array and has items to sort
  if (!Array.isArray(items) || items.length === 0) {
    console.warn("sortItems: Invalid items array or empty array passed.");
    return [];
  }

  items = items.sort((a, b) => {
    if (key === "updated_dt" || key === "created_dt") {
      return direction === "asc"
        ? new Date(a[key]) - new Date(b[key])
        : new Date(b[key]) - new Date(a[key]);
    } else {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    }
  });

  return items;
};

/**
 * Get the sort icon based on the current sort configuration.
 * @param {String} key - The key to check the sort configuration against.
 * @param {Object} sortConfig - The current sort configuration object.
 * @returns {JSX.Element} - The corresponding sort icon element.
 */

export const getSortIcon = (key, sortConfig) => {
  if (sortConfig.key === key) {
    if (sortConfig.direction === "asc") {
      return <i className="fa-solid fa-sort-up"></i>;
    } else {
      return <i className="fa-solid fa-sort-down"></i>;
    }
  }
  return <i className="fa-solid fa-sort"></i>;
};
