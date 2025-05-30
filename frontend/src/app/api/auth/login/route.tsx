import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { apiFetch } from '@/libs/api'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const res = await apiFetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      let errText: string;
      let err: any;
      
      try {
        err = await res.json()
      } catch (e) {
        errText = await res.text()
        err = { detail: errText || 'Ошибка входа' }
      }
      
      return NextResponse.json(
        { detail: err.detail || 'Ошибка входа', status: res.status },
        { status: res.status }
      )
    }

    // Получаем токен из Set-Cookie заголовка
    const setCookieHeader = res.headers.get('set-cookie')
    
    if (!setCookieHeader) {
      return NextResponse.json({ detail: 'Токен не получен' }, { status: 401 })
    }

    // Проверяем валидность токена, делая запрос к /me
    const verifyRes = await apiFetch('/me', {
      headers: {
        'cookie': setCookieHeader
      }
    })

    if (!verifyRes.ok) {
      let verifyErrText: string;
      try {
        const verifyErr = await verifyRes.json()
        verifyErrText = verifyErr.detail || 'Невалидный токен'
      } catch (e) {
        verifyErrText = await verifyRes.text()
      }
      return NextResponse.json({ detail: verifyErrText }, { status: 401 })
    }

    // Создаем ответ с успешным статусом
    const response = NextResponse.json({ success: true })
    
    // Копируем все куки из ответа бэкенда в наш ответ
    response.headers.set('set-cookie', setCookieHeader)

    return response
  } catch (error) {
    console.error('Login error:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
