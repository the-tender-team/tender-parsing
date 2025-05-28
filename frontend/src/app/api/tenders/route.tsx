import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { apiFetch } from '@/libs/api'
import { getUserFromBackend } from '@/libs/auth'

export async function GET(request: Request) {
  try {
    // Проверяем авторизацию
    const user = await getUserFromBackend()
    if (!user) {
      return NextResponse.json(
        { detail: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    // Получаем параметры запроса
    const { searchParams } = new URL(request.url)
    const queryParams = new URLSearchParams(searchParams)

    // Получаем токен из куки для запроса к бэкенду
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ')

    // Отправляем запрос на бэкенд
    const res = await apiFetch(`/tenders?${queryParams.toString()}`, {
      headers: {
        'Cookie': cookieHeader
      }
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
        { detail: error.detail || 'Ошибка получения тендеров' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in tenders API route:', error)
    return NextResponse.json(
      { detail: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}