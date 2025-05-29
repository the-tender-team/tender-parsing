import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { apiFetch } from '@/libs/api'
import { getUserFromBackend } from '@/libs/auth'

export async function POST() {
  try {
    // Получаем данные пользователя
    const userData = await getUserFromBackend()
    
    if (!userData) {
      return NextResponse.json(
        { detail: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    if (userData.role !== 'user') {
      return NextResponse.json(
        { detail: 'Заявку могут подавать только пользователи' },
        { status: 403 }
      )
    }

    // Получаем куки для передачи на бэкенд
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll()
      .map((cookie: { name: string, value: string }) => `${cookie.name}=${cookie.value}`)
      .join('; ')

    // Отправляем запрос на бэкенд
    const res = await apiFetch('/admin-request', {
      method: 'POST',
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
        { detail: error.detail || 'Ошибка подачи заявки' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in admin-request API route:', error)
    return NextResponse.json(
      { detail: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}