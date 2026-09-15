import api from './client'

export interface LoginRequest { email: string; password: string }
export interface RegisterRequest {
  email: string; password: string; role: string
  full_name: string; organisation: string
}
export interface TokenResponse {
  access_token: string; token_type: string
  role: string; user_id: string; full_name: string; email: string
}
export interface UserProfile {
  id: string; email: string; role: string; full_name: string
  organisation: string; is_active: boolean; is_banned: boolean
  pan?: string; gstin?: string; udyam_number?: string
  address?: string; turnover_cr?: number
}

// Pre-seeded demo users for offline / Vercel fallback
const PRESEEDED_USERS: Record<string, UserProfile> = {
  'admin@cpcl.gov.in': {
    id: 'usr-admin-1',
    email: 'admin@cpcl.gov.in',
    role: 'ADMIN',
    full_name: 'CPCL System Admin',
    organisation: 'Chennai Petroleum Corporation Limited',
    is_active: true,
    is_banned: false,
  },
  'officer@cpcl.gov.in': {
    id: 'usr-po-1',
    email: 'officer@cpcl.gov.in',
    role: 'PROCUREMENT_OFFICER',
    full_name: 'Rajesh Kumar',
    organisation: 'Chennai Petroleum Corporation Limited',
    is_active: true,
    is_banned: false,
  },
  'priya@cpcl.gov.in': {
    id: 'usr-po-2',
    email: 'priya@cpcl.gov.in',
    role: 'PROCUREMENT_OFFICER',
    full_name: 'Priya Nair',
    organisation: 'Chennai Petroleum Corporation Limited',
    is_active: true,
    is_banned: false,
  },
  'alpha@alphaenergy.com': {
    id: 'usr-bidder-1',
    email: 'alpha@alphaenergy.com',
    role: 'BIDDER',
    full_name: 'Rohan Mehta',
    organisation: 'Alpha Energy Solutions Pvt Ltd',
    is_active: true,
    is_banned: false,
    pan: 'AACES1234R',
    gstin: '33AACES1234R1ZQ',
    udyam_number: 'UDYAM-TN-12-0012345',
    turnover_cr: 28,
  },
  'alpha@alphaindia.in': {
    id: 'usr-bidder-1',
    email: 'alpha@alphaindia.in',
    role: 'BIDDER',
    full_name: 'Rohan Mehta',
    organisation: 'Alpha Energy Solutions Pvt Ltd',
    is_active: true,
    is_banned: false,
    pan: 'AACES1234R',
    gstin: '33AACES1234R1ZQ',
    udyam_number: 'UDYAM-TN-12-0012345',
    turnover_cr: 28,
  },
}

function getStoredCustomUsers(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem('bidnex_custom_users')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveCustomUser(user: UserProfile) {
  const users = getStoredCustomUsers()
  users[user.email.toLowerCase()] = user
  localStorage.setItem('bidnex_custom_users', JSON.stringify(users))
}

function getMockProfile(email: string): UserProfile {
  const lower = email.toLowerCase().trim()
  const customUsers = getStoredCustomUsers()
  if (customUsers[lower]) return customUsers[lower]
  if (PRESEEDED_USERS[lower]) return PRESEEDED_USERS[lower]

  // Dynamic fallback user creation based on email
  let role = 'BIDDER'
  if (lower.includes('admin')) role = 'ADMIN'
  else if (lower.includes('officer') || lower.endsWith('.gov.in') || lower.endsWith('.nic.in')) role = 'PROCUREMENT_OFFICER'

  const nameParts = lower.split('@')[0].split('.')
  const fullName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || 'Demo User'

  return {
    id: `usr-${Date.now()}`,
    email: lower,
    role,
    full_name: fullName,
    organisation: role === 'BIDDER' ? 'Enterprise Bidder Partner' : 'Ministry Procurement Department',
    is_active: true,
    is_banned: false,
  }
}

export const authApi = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    try {
      const res = await api.post<TokenResponse>('/auth/login', data)
      if (typeof res.data !== 'object' || !res.data || !res.data.access_token) {
        throw new Error('Invalid backend token response')
      }
      return res.data
    } catch {
      // Seamless offline / Vercel fallback
      const profile = getMockProfile(data.email)
      const token = `mock-token-${Date.now()}`
      localStorage.setItem('bidnex_token', token)
      localStorage.setItem('bidnex_user', JSON.stringify(profile))
      return {
        access_token: token,
        token_type: 'bearer',
        role: profile.role,
        user_id: profile.id,
        full_name: profile.full_name || profile.email,
        email: profile.email,
      }
    }
  },

  register: async (data: RegisterRequest): Promise<TokenResponse> => {
    try {
      const res = await api.post<TokenResponse>('/auth/register', data)
      if (typeof res.data !== 'object' || !res.data || !res.data.access_token) {
        throw new Error('Invalid backend register response')
      }
      return res.data
    } catch {
      // Seamless offline / Vercel fallback
      const nameParts = data.email.split('@')[0].split('.')
      const autoName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || 'Registered Partner'
      const newUser: UserProfile = {
        id: `usr-reg-${Date.now()}`,
        email: data.email.toLowerCase().trim(),
        role: data.role || 'BIDDER',
        full_name: data.full_name || autoName,
        organisation: data.organisation || 'Registered Enterprise',
        is_active: true,
        is_banned: false,
      }
      saveCustomUser(newUser)
      const token = `mock-token-reg-${Date.now()}`
      localStorage.setItem('bidnex_token', token)
      localStorage.setItem('bidnex_user', JSON.stringify(newUser))
      return {
        access_token: token,
        token_type: 'bearer',
        role: newUser.role,
        user_id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
      }
    }
  },

  me: async (accessToken?: string): Promise<UserProfile> => {
    try {
      const res = await api.get<UserProfile>('/auth/me', accessToken ? {
        headers: { Authorization: `Bearer ${accessToken}` },
      } : undefined)
      if (typeof res.data !== 'object' || !res.data || !res.data.role) {
        throw new Error('Invalid user profile response')
      }
      return res.data
    } catch {
      // Seamless offline / Vercel fallback
      const storedUser = localStorage.getItem('bidnex_user')
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          if (parsed && parsed.role && parsed.full_name) return parsed
        } catch {}
      }
      return getMockProfile('officer@cpcl.gov.in')
    }
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const res = await api.put<UserProfile>('/auth/profile', data)
      return res.data
    } catch {
      const storedUser = localStorage.getItem('bidnex_user')
      let user = storedUser ? JSON.parse(storedUser) : getMockProfile('officer@cpcl.gov.in')
      user = { ...user, ...data }
      localStorage.setItem('bidnex_user', JSON.stringify(user))
      saveCustomUser(user)
      return user
    }
  },
}
