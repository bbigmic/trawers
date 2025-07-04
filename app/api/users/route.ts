import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import { verifyToken } from '../../lib/auth'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    // Sprawdź token i uprawnienia administratora
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    // Pobierz listę użytkowników
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        bio: true,
        marketingConsent: true,
        dataProcessingConsent: true,
        consentDate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Błąd podczas pobierania użytkowników:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania użytkowników' },
      { status: 500 }
    )
  }
} 