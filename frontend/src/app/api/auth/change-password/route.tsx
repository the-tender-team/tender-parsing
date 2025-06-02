import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { apiFetch } from '@/libs/api'

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('access_token')?.value
    if (!token) {
      return NextResponse.json(
        { detail: 'Не авторизован' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const res = await apiFetch('/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${token}`
      },
      body: JSON.stringify(body)
    })

    // Если ответ не ok, просто пробрасываем ошибку от бэкенда
    if (!res.ok) {
      const error = await res.json().catch(() => ({
        detail: 'Ошибка сервера'
      }))
      return NextResponse.json(error, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { detail: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
