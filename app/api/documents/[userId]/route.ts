import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'
import { cookies } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
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

    // Pobierz dokumenty użytkownika
    const documents = await prisma.document.findMany({
      where: {
        userId: params.userId,
      },
      select: {
        id: true,
        name: true,
        url: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Błąd podczas pobierania dokumentów użytkownika:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania dokumentów użytkownika' },
      { status: 500 }
    )
  }
} 