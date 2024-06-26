/**
 * Generic function to close a modal by resetting its state.
 * @param {Function} setModalInfo - The state setter function for the modal information.
 */
export const closeModal = (setModalInfo) => {
  setModalInfo({ show: false, index: null, newStatus: "" });
};

/** Generic function to request a toggle status change and update the modal state.
 * @param {Array} items - The current state array.
 * @param {Function} setModalInfo -The state setter function for the modal information.
 * @param {Number} index - The index of the item to be toggled.
 * @param {String} key - The key for the status field (default is 'status').
 */
export const requestToggleStatus = (
  items,
  setModalInfo,
  index,
  key = "status"
) => {
  const newStatus = items[index][key] === "active" ? "inactive" : "active";
  setModalInfo({ show: true, index, newStatus });
};
