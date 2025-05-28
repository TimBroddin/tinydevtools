export const convertTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  
  // Format date as YYYY-MM-DD
  const dateString = date.toISOString().split('T')[0];
  
  // Format time as HH:MM:SS
  const timeString = date.toTimeString().split(' ')[0];
  
  return { dateString, timeString, date };
};

export const formatTimestamp = (timestamp: number, format: 'local' | 'utc' | 'iso' | 'relative') => {
  const date = new Date(timestamp * 1000);
  
  switch (format) {
    case 'local':
      return date.toLocaleString();
    case 'utc':
      return date.toUTCString();
    case 'iso':
      return date.toISOString();
    case 'relative': {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 0) {
        return 'In the future';
      }
      
      if (diffInSeconds < 60) {
        return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
      }
      
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      }
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
      }
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
      }
      
      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
      }
      
      const diffInYears = Math.floor(diffInMonths / 12);
      return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
    }
    default:
      return date.toLocaleString();
  }
};