import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { apiFetch } from '@/libs/api'
import { getUserFromBackend, getTokenFromCookies } from '@/libs/auth'

interface ParseParams {
  pageStart?: number
  pageEnd?: number
  priceFrom?: number
  priceTo?: number
  terminationGrounds?: number[]
  sortBy?: number
  sortAscending?: boolean
  searchString?: string
  contractDateFrom?: string
  contractDateTo?: string
  publishDateFrom?: string
  publishDateTo?: string
  updateDateFrom?: string
  updateDateTo?: string
  executionDateStart?: string
  executionDateEnd?: string
}

export async function POST(req: Request) {
  try {
    // Проверяем авторизацию
    const user = await getUserFromBackend()
    if (!user) {
      return NextResponse.json(
        { detail: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    // Проверяем роль
    if (user.role !== 'admin' && user.role !== 'owner') {
      return NextResponse.json(
        { detail: 'Недостаточно прав для запуска парсинга' },
        { status: 403 }
      )
    }

    const body = await req.json()

    // Получаем токен и куки для запроса к бэкенду
    const token = await getTokenFromCookies()
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ')

    // Отправляем запрос на бэкенд
    const res = await apiFetch('/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
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
        { detail: error.detail || 'Ошибка при запуске парсинга' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in parse API route:', error)
    return NextResponse.json(
      { detail: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}