/**
 * API endpoint constants
 * Note: The base URL and /api prefix are handled by the HttpService,
 * so these constants include only the paths after /api/
 */

// Stock endpoints
export const STOCK_ENDPOINTS = {
  SEARCH: '/stocks/search-combined',
  QUOTE: (symbol: string) => `/stocks/${symbol}/quote`,
  DETAILS: (symbol: string) => `/stocks/${symbol}/details`,
};

// Portfolio endpoints
export const PORTFOLIO_ENDPOINTS = {
  BASE: '/portfolio',
  DELETE: (symbol: string) => `/portfolio/${symbol}`,
};

// Helper function to add query parameters
export const addQueryParams = (
  url: string,
  params: Record<string, string>
): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};
