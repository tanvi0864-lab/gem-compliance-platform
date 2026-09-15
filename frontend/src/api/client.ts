import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 60000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bidnex_token')
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => {
    // If response is HTML string (e.g. Vercel SPA rewrite fallback for missing backend API), treat as API error so fallback triggers
    if (typeof res.data === 'string' && res.data.trim().toLowerCase().startsWith('<!doctype')) {
      const error: any = new Error('Backend API unavailable')
      error.response = { status: 404, data: { detail: 'Backend API unavailable' } }
      return Promise.reject(error)
    }
    return res
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bidnex_token')
      localStorage.removeItem('bidnex_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
