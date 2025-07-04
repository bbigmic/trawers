import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Sprawdź token i uprawnienia użytkownika
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Nieprawidłowy token' }, { status: 401 })
    }

    // Pobierz zamówienia użytkownika wraz z danymi kursu
    const orders = await prisma.order.findMany({
      where: {
        userId: decoded.userId,
      },
      include: {
        course: {
          select: {
            title: true,
            description: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Błąd podczas pobierania zamówień:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania zamówień' },
      { status: 500 }
    )
  }
} 