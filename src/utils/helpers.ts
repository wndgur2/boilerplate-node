/**
 * Utility functions for the application
 */

/**
 * Delay execution for a specified time
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Check if a value is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate a random string
 */
export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Parse pagination parameters
 */
export const parsePaginationParams = (
  limit?: string | number,
  offset?: string | number
): { limit: number; offset: number } => {
  const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit || 100;
  const parsedOffset = typeof offset === 'string' ? parseInt(offset, 10) : offset || 0;
  
  return {
    limit: Math.min(Math.max(parsedLimit, 1), 1000), // Min 1, max 1000
    offset: Math.max(parsedOffset, 0), // Min 0
  };
};
