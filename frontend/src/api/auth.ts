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

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<TokenResponse>('/auth/login', data).then(r => r.data),

  register: (data: RegisterRequest) =>
    api.post<TokenResponse>('/auth/register', data).then(r => r.data),

  me: (accessToken?: string) => api.get<UserProfile>('/auth/me', accessToken ? {
    headers: { Authorization: `Bearer ${accessToken}` },
  } : undefined).then(r => r.data),

  updateProfile: (data: Partial<UserProfile>) =>
    api.put<UserProfile>('/auth/profile', data).then(r => r.data),
}
