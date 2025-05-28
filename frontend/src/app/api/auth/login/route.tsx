import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { apiFetch } from '@/libs/api'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Login request body:', body)

    console.log('Attempting to connect to backend at:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
    
    const res = await apiFetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    console.log('Login response status:', res.status)
    console.log('Login response headers:', Object.fromEntries(res.headers.entries()))

    if (!res.ok) {
      let errText: string;
      let err: any;
      
      try {
        err = await res.json()
        console.error('Login error response (JSON):', err)
      } catch (e) {
        errText = await res.text()
        console.error('Login error response (Text):', errText)
        err = { detail: errText || 'Ошибка входа' }
      }
      
      return NextResponse.json(
        { detail: err.detail || 'Ошибка входа', status: res.status },
        { status: res.status }
      )
    }

    // Получаем токен из Set-Cookie заголовка
    const setCookieHeader = res.headers.get('set-cookie')
    console.log('Set-Cookie header:', setCookieHeader)
    
    if (!setCookieHeader) {
      console.error('No Set-Cookie header in response')
      return NextResponse.json({ detail: 'Токен не получен' }, { status: 401 })
    }

    // Проверяем валидность токена, делая запрос к /me
    console.log('Verifying token with /me endpoint...')
    const verifyRes = await apiFetch('/me', {
      headers: {
        'cookie': setCookieHeader
      }
    })

    console.log('Verify token response status:', verifyRes.status)

    if (!verifyRes.ok) {
      console.error('Token verification failed. Status:', verifyRes.status)
      let verifyErrText: string;
      try {
        const verifyErr = await verifyRes.json()
        console.error('Verify error details:', verifyErr)
        verifyErrText = verifyErr.detail || 'Невалидный токен'
      } catch (e) {
        verifyErrText = await verifyRes.text()
        console.error('Verify error raw response:', verifyErrText)
      }
      return NextResponse.json({ detail: verifyErrText }, { status: 401 })
    }

    // Создаем ответ с успешным статусом
    const response = NextResponse.json({ success: true })
    
    // Копируем все куки из ответа бэкенда в наш ответ
    response.headers.set('set-cookie', setCookieHeader)

    return response
  } catch (error) {
    console.error('Login error:', error)
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
