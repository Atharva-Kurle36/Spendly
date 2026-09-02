export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8788/api',
  FIREBASE: {
    API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  }
} as const;
