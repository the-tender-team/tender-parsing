import { NextRequest, NextResponse } from 'next/server'
import { apiFetch } from '@/libs/api'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const res = await apiFetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const error = await res.json()
    return NextResponse.json(error, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
