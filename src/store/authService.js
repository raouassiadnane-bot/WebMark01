import api from './api'

const AUTH_PATH = '/auth' // adjust depending on MockAPI routes

const register = async ({name,email,password}) => {
  // MockAPI: create a user resource
  const res = await api.post('/users', {name,email,password,verified:false})
  return res.data
}

const login = async ({email,password}) => {
  // Mock behaviour: search user and return token stub
  const res = await api.get('/users', { params: { email } })
  const user = res.data?.[0]
  if(!user || user.password !== password) throw new Error('Identifiants invalides')
  const token = 'mock-token-' + user.id
  localStorage.setItem('token', token)
  return { user, token }
}

const getProfile = async () => {
  // Example: fetch current user; in mock, find by token
  return null
}

export default { register, login, getProfile }
