import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = {
  get: async (endpoint) => request(endpoint, { method: 'GET' }),
  post: async (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: async (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  patch: async (endpoint, body) => request(endpoint, { method: 'PATCH', body }),
  delete: async (endpoint) => request(endpoint, { method: 'DELETE' }),
  upload: async (endpoint, formData) => request(endpoint, { method: 'POST', body: formData, isFormData: true }),
};

const request = async (endpoint, options) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = new Headers();
  if (session?.access_token) {
    headers.append('Authorization', `Bearer ${session.access_token}`);
  }

  let body = options.body;
  if (body && !options.isFormData) {
    headers.append('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }

  const config = {
    method: options.method,
    headers,
    body,
    signal: options.signal, 
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      return;
    }
    console.error(`API Error on ${options.method} ${endpoint}:`, error.message);
    throw error;
  }
};