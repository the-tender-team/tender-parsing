import { cookies } from 'next/headers'
import { apiFetch } from './api'

export async function getTokenFromCookies() {
  return (await cookies()).get('access_token')?.value || ''
}

export async function getUserFromBackend() {
  const token = await getTokenFromCookies()
  if (!token) return null

  // Получаем все куки для дополнительных данных
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ')

  const res = await apiFetch('/me', {
    headers: { 
      'Cookie': cookieHeader,
      'Authorization': `Bearer ${token}`  // Добавляем токен в заголовок Authorization
    },
    cache: 'no-store'
  })

  if (!res.ok) return null
  return res.json()
}
