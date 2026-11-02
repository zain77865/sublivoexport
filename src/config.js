export const API_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost') ? import.meta.env.VITE_API_URL : '/api')
  : (import.meta.env.VITE_API_URL || '/api');
