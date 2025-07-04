import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import { verifyToken } from '../../lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Nieprawidłowy token' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        bio: true,
        avatarUrl: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Użytkownik nie znaleziony' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Błąd podczas pobierania profilu:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania profilu' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Nieprawidłowy token' }, { status: 401 })
    }

    const data = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        bio: data.bio,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        bio: true,
        avatarUrl: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Błąd podczas aktualizacji profilu:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji profilu' },
      { status: 500 }
    )
  }
} 