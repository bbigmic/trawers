import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
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
    return NextResponse.json(
      { error: 'Błąd podczas pobierania statystyk' },
      { status: 500 }
    )
  }
} 