/**
 * Export data to CSV format
 * @param {Array} data - The data array to export
 * @param {string} filename - The filename to save as
 */
export const exportToCSV = (data, filename = 'sales-forecast.csv') => {
  if (!data || !data.length) {
    console.error('No data to export');
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV string
  const csvContent = [
    // Add the header row
    headers.join(','),
    // Add the data rows
    ...data.map(row => 
      headers.map(field => {
        const value = row[field];
        // Handle strings that contain commas by wrapping in quotes
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  // Create a blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate sample data for the forecasting tool
 * @returns {Array} Array of sample data objects
 */
export const getSampleData = () => {
  return [
    {
      period: 'Jan 2023',
      x: 105,
      y: 22,
      adSpend: 5250,
      cpl: 50,
      cpa: 238.64,
      conversionRate: 20.95
    },
    {
      period: 'Feb 2023',
      x: 120,
      y: 27,
      adSpend: 6000,
      cpl: 50,
      cpa: 222.22,
      conversionRate: 22.5
    },
    {
      period: 'Mar 2023',
      x: 142,
      y: 32,
      adSpend: 7100,
      cpl: 50,
      cpa: 221.88,
      conversionRate: 22.54
    },
    {
      period: 'Apr 2023',
      x: 165,
      y: 36,
      adSpend: 8250,
      cpl: 50,
      cpa: 229.17,
      conversionRate: 21.82
    },
    {
      period: 'May 2023',
      x: 180,
      y: 40,
      adSpend: 9000,
      cpl: 50,
      cpa: 225,
      conversionRate: 22.22
    },
    {
      period: 'Jun 2023',
      x: 210,
      y: 45,
      adSpend: 10500,
      cpl: 50,
      cpa: 233.33,
      conversionRate: 21.43
    }
  ];
};

/**
 * Save data to local storage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to local storage:', error);
    return false;
  }
};

/**
 * Load data from local storage
 * @param {string} key - Storage key
 * @returns {any} Parsed data or null if not found
 */
export const loadFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from local storage:', error);
    return null;
  }
};
