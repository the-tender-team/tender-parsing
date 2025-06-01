import { NextRequest, NextResponse } from 'next/server'
import { apiFetch } from '@/libs/api'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { detail: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const res = await apiFetch(`/admin-request-status/${params.username}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      // Если сервер вернул ошибку, пробрасываем её дальше
      const error = await res.json()
      return NextResponse.json(
        { detail: error.detail || 'Ошибка сервера' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in admin-request-status API route:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { detail: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 