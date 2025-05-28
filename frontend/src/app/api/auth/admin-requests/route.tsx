import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { apiFetch } from '@/libs/api'
import { getUserFromBackend, getTokenFromCookies } from '@/libs/auth'

export async function GET() {
  try {
    // Проверяем авторизацию и роль
    const user = await getUserFromBackend()
    if (!user) {
      return NextResponse.json(
        { detail: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    if (user.role !== 'owner') {
      return NextResponse.json(
        { detail: 'Недостаточно прав для просмотра заявок' },
        { status: 403 }
      )
    }

    // Получаем токен и куки для запроса к бэкенду
    const token = await getTokenFromCookies()
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll()
      .map((cookie: { name: string, value: string }) => `${cookie.name}=${cookie.value}`)
      .join('; ')

    // Отправляем запрос на бэкенд
    const res = await apiFetch('/admin-requests', {
      headers: {
        'Cookie': cookieHeader,
        'Authorization': `Bearer ${token}`
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
        { detail: error.detail || 'Ошибка получения заявок' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in admin-requests API route:', error)
    return NextResponse.json(
      { detail: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    // Проверяем авторизацию и роль
    const user = await getUserFromBackend()
    if (!user) {
      return NextResponse.json(
        { detail: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    if (user.role !== 'user') {
      return NextResponse.json(
        { detail: 'Заявку могут подавать только пользователи' },
        { status: 403 }
      )
    }

    // Получаем токен и куки для запроса к бэкенду
    const token = await getTokenFromCookies()
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll()
      .map((cookie: { name: string, value: string }) => `${cookie.name}=${cookie.value}`)
      .join('; ')

    // Отправляем запрос на бэкенд
    const res = await apiFetch('/admin-requests', {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Authorization': `Bearer ${token}`
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
        { detail: error.detail || 'Ошибка подачи заявки' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in admin-requests API route:', error)
    return NextResponse.json(
      { detail: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 