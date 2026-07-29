import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

// NOTE: 정식 인증 붙기 전까지 X-User-Id 헤더로 사용자를 구분(기본값 1)
// TODO(backend): 로그인/인증 도입되면 X-User-Id 대신 토큰 기반 인증으로 교체
const USER_ID =
  import.meta.env.VITE_USER_ID ?? '8b9dfd43-d2a5-4977-aa0b-66cd9bc091f0'

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'X-User-Id': USER_ID,
  },
})
