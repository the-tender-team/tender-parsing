import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { apiFetch } from '@/libs/api'

export async function GET() {
  // Получаем все куки
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ')

  if (!cookieHeader) {
    return NextResponse.json({ detail: 'Не авторизован' }, { status: 401 })
  }

  try {
    const res = await apiFetch('/me', {
      headers: { 
        'cookie': cookieHeader
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      let error;
      try {
        error = await res.json()
      } catch (e) {
        const text = await res.text()
        error = { detail: text || 'Ошибка сервера' }
      }
      return NextResponse.json(
        { detail: error.detail || 'Не авторизован' },
        { status: res.status }
      )
    }

    const user = await res.json()
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { detail: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
