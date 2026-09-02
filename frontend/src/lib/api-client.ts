import { API_CONFIG } from '@/config';

class ApiClient {
  private getToken: (() => Promise<string | null>) | null = null;

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
    if (!response.ok || !data.success) {
      throw new Error(data?.error?.message || 'API request failed');
    }

    return data.data;
  }

  // Auth sync
  syncUser() {
    return this.fetchWithAuth(API_CONFIG.endpoints.users.sync, { method: 'POST' });
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
