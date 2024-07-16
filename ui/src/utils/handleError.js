export const handleError = (setError, errorMessage) => {
  setError(errorMessage);
  setTimeout(() => {
    setError(null);
  }, 3000);
};
