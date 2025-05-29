import { cookies } from 'next/headers'
import { apiFetch } from './api'

export async function getTokenFromCookies() {
  const token = (await cookies()).get('access_token')?.value || ''
  return token
}

export async function getUserFromBackend() {
  const token = await getTokenFromCookies()
  if (!token) return null

  const res = await apiFetch('/me', {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Cookie': `access_token=${token}`
    },
    credentials: 'include',
    cache: 'no-store'
  })

  if (!res.ok) return null
  return res.json()
}
