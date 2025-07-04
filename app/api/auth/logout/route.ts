import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST() {
  const response = NextResponse.json(
    { message: 'Wylogowano pomyślnie' },
    { status: 200 }
  )

  response.cookies.delete('token')

  return response
} 