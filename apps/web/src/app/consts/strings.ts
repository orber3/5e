export const APP_TITLE = 'ER Exchange';

export const LOGIN_PAGE = {
  TITLE: 'Log In',
  NO_ACCOUNT_TEXT: "Don't have an account?",
  REGISTER_LINK_TEXT: 'Register now!',
};

export const REGISTER_PAGE = {
  TITLE: 'Register',
  HAVE_ACCOUNT_TEXT: 'Already have an account?',
  LOGIN_LINK_TEXT: 'Log in!',
};

export const DASHBOARD_PAGE = {
  TITLE: 'Dashboard',
  WELCOME_TITLE: 'Welcome',
  DEFAULT_USER: 'User',
  ACCOUNT_INFO: {
    TITLE: 'Account Information',
    EMAIL_LABEL: 'Email:',
    USER_ID_LABEL: 'User ID:',
    CREATED_AT_LABEL: 'Created at:',
    NOT_AVAILABLE: 'N/A',
  },
};

export const PORTFOLIO_PAGE = {
  TITLE: 'My Stock Portfolio',
  EMPTY: 'Your portfolio is empty. Use the search bar to find and add stocks.',
  REFRESH: 'Refresh Quotes',
  LOADING: 'Loading your portfolio...',
  COUNT: (count: number) => `You have ${count} stocks in your portfolio.`,
  EMPTY_ACTION: 'Start building your portfolio by adding stocks.',
};

export const STOCK_DETAILS_PAGE = {
  BACK: 'Back to Portfolio',
  LOADING: 'Loading stock details...',
  ADD: 'Add to Portfolio',
  ABOUT: 'About Company',
  STATS: 'Key Statistics',
  NO_DESCRIPTION: 'No description available for this company.',
  PRICE: 'Price',
  CHANGE: 'Change',
  MARKET_CAP: 'Market Cap',
  DAY_RANGE: 'Day Range',
  YEAR_RANGE: '52 Week Range',
  VOLUME: 'Volume',
  PE_RATIO: 'P/E Ratio',
  EPS: 'EPS',
  INDUSTRY: 'Industry',
  SECTOR: 'Sector',
  CEO: 'CEO',
  BETA: 'Beta',
  WEBSITE: 'Website',
};

export const STOCK_SEARCH = {
  PLACEHOLDER: 'Search stocks...',
  LOADING: 'Searching...',
  NO_RESULTS: 'No results found',
};

export const STOCK_CHART = {
  TITLE: (name: string) => `${name} - Price Chart `,
};

export const WELCOME_PAGE = {
  APP_NAME: 'My App',
  LOGIN_BUTTON: 'Login',
  REGISTER_BUTTON: 'Register',
  WELCOME_HEADING: 'Welcome to Our Application',
  WELCOME_DESCRIPTION:
    'This is a demo application with authentication features built with React, Ant Design, and NestJS backend with MongoDB.',
  FEATURES: {
    HEADING: 'Features',
    LIST: [
      'User authentication with JWT',
      'Secure cookie-based authentication',
      'User registration and login',
      'Protected routes',
      'MongoDB database',
      'React with Ant Design UI components',
    ],
  },
};
