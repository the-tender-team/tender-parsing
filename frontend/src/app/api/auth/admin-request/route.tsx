import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const token = (await cookies()).get('token')?.value
    
    if (!token) {
      return NextResponse.json(
        { detail: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const res = await fetch('http://localhost:8000/admin-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      // Пытаемся получить JSON ошибки, если сервер его вернул
      const errorData = await res.json().catch(() => ({
        detail: `Ошибка сервера: ${res.statusText}`
      }))
      
      return NextResponse.json(
        { detail: errorData.detail || 'Ошибка при обработке запроса' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })

  } catch (error) {
    console.error('Ошибка в API роуте /admin-request:', error)
    return NextResponse.json(
      { detail: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}