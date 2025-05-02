/**
 * Common UI selectors for e2e tests
 */

export const selectors = {
  // Navigation elements
  nav: {
    logo: '.navbar-logo',
    menu: '.navbar-menu',
    userMenu: '.user-menu',
    portfolioLink: 'a[href="/portfolio"]',
  },

  // Toast notifications
  toast: {
    container: '.Toastify',
    success: '.Toastify__toast--success',
    error: '.Toastify__toast--error',
  },

  // Common elements
  common: {
    loadingSpinner: '.ant-spin',
    button: (text: string) => `button:has-text("${text}")`,
    heading: (level: number, text: string) => `h${level}:has-text("${text}")`,
    emptyState: '.ant-empty',
  },

  // Form elements
  form: {
    input: (name: string) => `input[name="${name}"]`,
    submit: 'button[type="submit"]',
    error: '.ant-form-item-explain-error',
  },

  // Table elements
  table: {
    container: '.ant-table',
    row: (key: string) => `tr[data-row-key="${key}"]`,
    cell: (rowKey: string, column: number) =>
      `tr[data-row-key="${rowKey}"] td:nth-child(${column})`,
    header: (text: string) => `.ant-table-thead th:has-text("${text}")`,
  },
};
