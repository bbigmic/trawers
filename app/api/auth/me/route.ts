import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    console.log('Token w /api/auth/me:', token ? `${token.substring(0, 20)}...` : 'brak')

    if (!token) {
      console.log('Brak tokenu w /api/auth/me')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    console.log('Zdekodowany token:', decoded)

    if (!decoded || !decoded.userId) {
      console.log('Nieprawidłowy token w /api/auth/me')
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        bio: true,
        avatarUrl: true,
        marketingConsent: true,
        dataProcessingConsent: true,
        consentDate: true,
      },
    })

    console.log('Znaleziony użytkownik:', user)

    if (!user) {
      console.log('Nie znaleziono użytkownika w /api/auth/me')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Błąd w /api/auth/me:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 