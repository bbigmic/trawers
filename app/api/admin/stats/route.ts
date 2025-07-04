import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Sprawdź czy baza danych jest dostępna
    if (!process.env.DATABASE_URL) {
      console.error('Brak DATABASE_URL')
      return NextResponse.json(
        { error: 'Baza danych nie jest skonfigurowana' },
        { status: 500 }
      )
    }

    const [
      totalCourses,
      totalOrders,
      totalRevenue,
      recentOrders
    ] = await Promise.all([
      prisma.course.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          amount: true
        }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: true,
          course: true
        }
      })
    ])

    return NextResponse.json({
      totalCourses,
      totalOrders,
      totalRevenue: totalRevenue._sum.amount || 0,
      recentOrders
    })
  } catch (error) {
    console.error('Błąd podczas pobierania statystyk:', error)
    
    // Zwróć dane domyślne w przypadku błędu
    return NextResponse.json({
      totalCourses: 0,
      totalOrders: 0,
      totalRevenue: 0,
      recentOrders: []
    })
  }
} 