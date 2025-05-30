/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Check if date is today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if date is tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // Check if date is yesterday
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  // Compare dates without time
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  if (dateOnly.getTime() === today.getTime()) {
    return 'Today';
  } else if (dateOnly.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else if (dateOnly.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }
  
  // Format date as Month Day, Year
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: dateOnly.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Format minutes to hours and minutes
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${mins} min`;
};