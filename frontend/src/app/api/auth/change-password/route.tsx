import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { apiFetch } from '@/libs/api'

export async function POST(req: NextRequest) {
  const token = (await cookies()).get('token')?.value
  const body = await req.json()
  const res = await apiFetch('/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
