import { apiFetch } from '@/libs/api';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getTokenFromCookies } from '@/libs/auth';

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: NextRequest,
  context: RouteParams
) {
  console.log('[API] Received analysis request');
  
  try {
    // Получаем токен для авторизации
    const token = await getTokenFromCookies();
    console.log('[API] Token status:', token ? 'present' : 'missing');
    
    if (!token) {
      console.log('[API] Request rejected: no token');
      return NextResponse.json(
        { detail: 'Токен отсутствует' },
        { status: 401 }
      );
    }

    // Получаем куки для запроса
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
    console.log('[API] Cookies present:', cookieStore.getAll().length > 0);

    // Ожидаем получение параметров маршрута
    const params = await context.params;
    const tenderId = params.id;
    console.log('[API] Processing analysis for tender:', tenderId);

    console.log('[API] Sending request to backend');
    const res = await apiFetch(`/tenders/${tenderId}/analyze`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    console.log('[API] Backend response status:', res.status);
    
    // Сначала получаем текст ответа
    const responseText = await res.text();
    console.log('[API] Backend response text:', responseText.slice(0, 100) + '...');
    
    if (!res.ok) {
      try {
        // Пробуем распарсить как JSON
        const error = JSON.parse(responseText);
        console.log('[API] Error response:', error);
        return NextResponse.json(
          { detail: error.detail || 'Ошибка анализа тендера' },
          { status: res.status }
        );
      } catch {
        // Если не получилось распарсить как JSON, возвращаем текст как есть
        console.log('[API] Non-JSON error response');
        return NextResponse.json(
          { detail: responseText || 'Ошибка анализа тендера' },
          { status: res.status }
        );
      }
    }

    try {
      // Пробуем распарсить успешный ответ как JSON
      const data = JSON.parse(responseText);
      console.log('[API] Successfully parsed response');
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('[API] Error parsing response:', parseError);
      return NextResponse.json(
        { detail: 'Ошибка при обработке ответа сервера' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[API] Error analyzing tender:', error);
    return NextResponse.json(
      { detail: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 