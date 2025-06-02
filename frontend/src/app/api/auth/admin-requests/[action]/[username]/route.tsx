import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { apiFetch } from '@/libs/api'
import { getTokenFromCookies, getUserFromBackend } from '@/libs/auth'

export async function POST(
  req: NextRequest,
  { params }: { params: { action: string; username: string } }
) {
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
        { detail: 'Недостаточно прав для управления заявками' },
        { status: 403 }
      )
    }

    const { action, username } = params
    if (!username || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { detail: 'Некорректные параметры запроса' },
        { status: 400 }
      )
    }

    // Получаем токен
    const token = await getTokenFromCookies()
    if (!token) {
      return NextResponse.json(
        { detail: 'Токен отсутствует' },
        { status: 401 }
      )
    }

    // Получаем куки
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll()
      .map((cookie: { name: string, value: string }) => `${cookie.name}=${cookie.value}`)
      .join('; ')

    // Отправляем запрос на бэкенд
    const res = await apiFetch(`/admin-requests/${action}/${username}`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
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

      // Если бэкенд вернул 401, значит токен невалидный
      if (res.status === 401) {
        return NextResponse.json(
          { detail: 'Сессия истекла, необходимо войти заново' },
          { status: 401 }
        )
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