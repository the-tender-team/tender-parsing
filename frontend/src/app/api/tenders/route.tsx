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
    console.log('Received request with params:', Object.fromEntries(searchParams.entries()));

    const queryParams = new URLSearchParams(searchParams)

    // Получаем токен из куки для запроса к бэкенду
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ')

    console.log('Sending request to backend:', `/tenders?${queryParams.toString()}`);
    
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

      console.error('Backend error:', error);
      return NextResponse.json(
        { detail: error.detail || 'Ошибка получения тендеров' },
        { status: res.status }
      )
    }

    const data = await res.json()
    console.log('Received data from backend:', {
      count: Array.isArray(data) ? data.length : 'not an array',
      firstItem: Array.isArray(data) && data.length > 0 ? data[0] : null,
      dataType: typeof data
    });

    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in tenders API route:', error)
    return NextResponse.json(
      { detail: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}