/**
 * Formats a date string for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Formats a date string with time
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};
