import axios from 'axios'

// Replace PROJECT_BASE with your MockAPI base URL for CRUD endpoints.
const API_BASE = import.meta.env.VITE_API_BASE || 'https://mockapi.io/projects/YOUR_PROJECT'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor example: attach token from localStorage
api.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token')
  if(token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
