import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { cookies } from 'next/headers'
import { apiFetch } from '@/libs/api'
import { getTokenFromCookies } from '@/libs/auth'

export async function POST(
  req: Request,
  { params }: { params: { action: string; username: string } }
) {
  try {
    const { action, username } = params

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { detail: 'Недопустимое действие' },
        { status: 400 }
      )
    }

    // Проверяем роль из заголовка, установленного middleware
    const headersList = await headers()
    const userRole = headersList.get('x-user-role')
    
    if (!userRole) {
      return NextResponse.json(
        { detail: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    if (userRole !== 'owner') {
      return NextResponse.json(
        { detail: 'Недостаточно прав для управления заявками' },
        { status: 403 }
      )
    }

    // Получаем токен и куки
    const token = await getTokenFromCookies()
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll()
      .map((cookie: { name: string, value: string }) => `${cookie.name}=${cookie.value}`)
      .join('; ')

    // Отправляем запрос на бэкенд
    const res = await apiFetch(`/admin-requests/${action}/${username}`, {
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
        { detail: error.detail || `Ошибка при ${action === 'approve' ? 'одобрении' : 'отклонении'} заявки` },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in admin-requests action API route:', error)
    return NextResponse.json(
      { detail: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 