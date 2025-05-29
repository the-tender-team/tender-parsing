import { cookies } from 'next/headers'
import { apiFetch } from './api'

export async function getTokenFromCookies() {
  return (await cookies()).get('access_token')?.value || ''
}

export async function getUserFromBackend() {
  const token = await getTokenFromCookies()
  if (!token) return null

  const res = await apiFetch('/me', {
    headers: { 
      'Authorization': `Bearer ${token}`
    },
    cache: 'no-store'
  })

  if (!res.ok) return null
  return res.json()
}
