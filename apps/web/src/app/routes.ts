/**
 * Application routes enum
 */
export enum AppRoutes {
  LOGIN = '/login',
  REGISTER = '/register',
  PORTFOLIO = '/portfolio',
  STOCK_DETAILS = '/stocks/:symbol',
}

// Helper to generate stock details route with actual symbol
export const getStockDetailsRoute = (symbol: string) => {
  return `/stocks/${symbol}`;
};

export default AppRoutes;
