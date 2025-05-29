import { NextResponse } from 'next/server'
import { apiFetch } from '@/libs/api'
import { getUserFromBackend, getTokenFromCookies } from '@/libs/auth'

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

    // Получаем токен для авторизации
    const token = await getTokenFromCookies()

    // Отправляем запрос на бэкенд
    const res = await apiFetch('/admin-request', {
      method: 'POST',
      headers: {
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
    console.error('Error in admin-request API route:', error)
    return NextResponse.json(
      { detail: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}