export const ROUTES = {
  home: '/',
  about: '/about',
  dashboard: {
    root: '/app',
    transactions: '/app/transactions',
    budgets: '/app/budgets',
    insights: '/app/insights',
    bills: '/app/bills',
    goals: '/app/goals',
    settings: '/app/settings',
  },
} as const;
