import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { apiFetch } from '@/libs/api'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const res = await apiFetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const err = await res.json() as { detail?: string }
      return NextResponse.json({ detail: err.detail || 'Ошибка входа' }, { status: 401 })
    }

    const data = await res.json() as { access_token: string }
    
    if (!data.access_token) {
      return NextResponse.json({ detail: 'Токен не получен' }, { status: 401 })
    }

    // Проверяем валидность токена, делая запрос к /me
    const verifyRes = await apiFetch('/me', {
      headers: { Authorization: `Bearer ${data.access_token}` }
    })

    if (!verifyRes.ok) {
      return NextResponse.json({ detail: 'Невалидный токен' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('token', data.access_token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
