import { env } from './env';

export const API_CONFIG = {
  baseUrl: env.API_URL,
  timeout: 30000,
  endpoints: {
    health: '/health',
    users: {
      sync: '/users/sync',
    },
    expenses: {
      list: '/expenses',
      create: '/expenses',
    },
    transactions: {
      import: '/transactions/import',
    },
    budgets: {
      list: '/budgets',
    },
    insights: {
      generate: '/insights/generate',
    },
  },
} as const;
