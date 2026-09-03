import { API_CONFIG } from '@/config';

class ApiClient {
  private getToken: (() => Promise<string | null>) | null = async () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('smartwallet-token');
    }
    return null;
  };

  setTokenProvider(provider: () => Promise<string | null>) {
    this.getToken = provider;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    if (this.getToken) {
      const token = await this.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    // Automatically handle 401 Unauthorized errors by clearing session and redirecting
    if (response.status === 401 || data.error?.code === 'UNAUTHORIZED') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('smartwallet-token');
        localStorage.removeItem('smartwallet-session');
        window.location.href = '/auth';
      }
      throw new Error('Session expired. Please log in again.');
    }
    
    if (!response.ok || !data.success) {
      throw new Error(data?.error?.message || 'API request failed');
    }

    return data.data;
  }

  // Auth sync
  syncUser() {
    return this.fetchWithAuth(API_CONFIG.endpoints.users.sync, { method: 'POST' });
  }

  // Generic HTTP Methods
  get(endpoint: string, options: RequestInit = {}) {
    return this.fetchWithAuth(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint: string, body?: any, options: RequestInit = {}) {
    return this.fetchWithAuth(endpoint, {
      ...options,
      method: 'POST',
      body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    });
  }

  put(endpoint: string, body?: any, options: RequestInit = {}) {
    return this.fetchWithAuth(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    });
  }

  delete(endpoint: string, options: RequestInit = {}) {
    return this.fetchWithAuth(endpoint, { ...options, method: 'DELETE' });
  }

  // Expenses
  getExpenses() {
    return this.fetchWithAuth(API_CONFIG.endpoints.expenses.list);
  }

  createExpense(expense: any) {
    return this.fetchWithAuth(API_CONFIG.endpoints.expenses.create, {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  // Insights
  generateInsight() {
    return this.fetchWithAuth(API_CONFIG.endpoints.insights.generate, { method: 'POST' });
  }
}

export const api = new ApiClient();
