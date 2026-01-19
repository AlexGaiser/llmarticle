/**
 * Formats a date string for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

/**
 * Formats a date string with time
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export function getDateString(dateString: Date): string {
  return dateString.toDateString();
}
