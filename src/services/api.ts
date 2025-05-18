import { handleResponse } from './utils';

const API_URL = 'http://localhost:8000/api';

const getHeaders = (contentType = 'application/json') => {
  const headers: Record<string, string> = {
    'Content-Type': contentType,
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const authService = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: getHeaders('application/x-www-form-urlencoded'),
      body: new URLSearchParams({ username: email, password }),
    });
    
    const data = await handleResponse(response);
    localStorage.setItem('token', data.access_token);
    return data;
  },
  
  async register(email: string, password: string, name: string) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    
    return handleResponse(response);
  },

  async logout() {
    localStorage.removeItem('token');
  },

  async checkAuth() {
    const response = await fetch(`${API_URL}/check-auth`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};

export const summarizationService = {
  uploadFile: async (file: File, language: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    const response = await fetch(`${API_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    return handleResponse(response);
  },
  
  getRequests: async () => {
    const response = await fetch(`${API_URL}/requests`, {
      headers: getHeaders(),
    });

    return handleResponse(response);
  },

  async translateText(text: string, targetLanguage: string): Promise<string> {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('target_language', targetLanguage);

    const response = await fetch(`${API_URL}/translate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const data = await handleResponse(response);
    return data.translated_text;
  },

  getRequestById: async (id: number) => {
    const response = await fetch(`${API_URL}/requests/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
}; 