import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import { verifyToken } from '../../lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    console.log('Pobieranie zamówień...')
    // Sprawdź token i uprawnienia administratora
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      console.error('Brak tokenu')
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      console.error('Nieprawidłowy token')
      return NextResponse.json({ error: 'Nieprawidłowy token' }, { status: 401 })
    }

    if (decoded.role !== 'ADMIN') {
      console.error('Brak uprawnień administratora')
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    // Pobierz listę zamówień wraz z danymi użytkownika i kursu
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        course: {
          select: {
            title: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log(`Znaleziono ${orders.length} zamówień`)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Błąd podczas pobierania zamówień:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania zamówień' },
      { status: 500 }
    )
  }
} 