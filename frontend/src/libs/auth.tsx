import { cookies } from 'next/headers'

export async function getTokenFromCookies() {
  return (await cookies()).get('token')?.value || ''
}

export async function getUserFromBackend() {
  const token = await getTokenFromCookies()
  if (!token) return null

  const res = await fetch('http://localhost:8000/me', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  })

  if (!res.ok) return null
  return res.json()
}
