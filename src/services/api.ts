import { AnalysisRecord, MaterialGuideItem, User, UserStats, UserMeasurements } from '../types';

const TOKEN_KEY = 'ecocycle_auth_token';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  async register(name: string, email: string, password: string, location?: string): Promise<{ token: string; user: User }> {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, location })
    });
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async demoLogin(accountType: 'champion' | 'student'): Promise<{ token: string; user: User }> {
    return request('/api/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ accountType })
    });
  },

  async getMe(): Promise<{ user: User; stats: UserStats }> {
    return request('/api/auth/me');
  },

  async updateProfile(updates: { name?: string; location?: string }): Promise<{ user: User }> {
    return request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string; tokenDeliveryNote?: string }> {
    return request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
  },

  async logout(): Promise<void> {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      authStorage.removeToken();
    }
  },

  // Waste Analysis
  async classifyWaste(payload: {
    imageBase64: string;
    mimeType: string;
    location?: string;
    userMeasurements?: UserMeasurements;
    userNotes?: string;
  }): Promise<{ success: boolean; data: AnalysisRecord }> {
    return request('/api/waste/classify', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getHistory(filters?: { category?: string; recyclability?: string; search?: string }): Promise<{ data: AnalysisRecord[] }> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.recyclability) params.append('recyclability', filters.recyclability);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/api/waste/history${queryString}`);
  },

  async getAnalysisById(id: string): Promise<{ data: AnalysisRecord }> {
    return request(`/api/waste/history/${id}`);
  },

  async deleteAnalysis(id: string): Promise<{ message: string }> {
    return request(`/api/waste/history/${id}`, {
      method: 'DELETE'
    });
  },

  async getStats(): Promise<{ data: UserStats }> {
    return request('/api/waste/stats');
  },

  async getMaterialGuide(): Promise<{ data: MaterialGuideItem[] }> {
    return request('/api/materials/guide');
  }
};
