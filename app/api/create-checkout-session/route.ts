import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import { verifyToken } from '../../lib/auth'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

console.log('Dostępne zmienne środowiskowe:', {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  STRIPE_SECRET_KEY_LENGTH: process.env.STRIPE_SECRET_KEY?.length,
  STRIPE_SECRET_KEY_START: process.env.STRIPE_SECRET_KEY?.substring(0, 10),
})

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(request: Request) {
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

    const { courseId } = await request.json()

    // Pobierz kurs
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Kurs nie został znaleziony' },
        { status: 404 }
      )
    }

    // Sprawdź czy użytkownik już kupił ten kurs
    const existingOrder = await prisma.order.findFirst({
      where: {
        userId: decoded.userId,
        courseId: courseId,
        status: 'COMPLETED',
      },
    })

    if (existingOrder) {
      return NextResponse.json(
        { error: 'Ten kurs został już zakupiony' },
        { status: 400 }
      )
    }

    // Utwórz sesję Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: Math.round(course.price * 100), // Stripe używa groszy
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-cancel`,
      metadata: {
        userId: decoded.userId,
        courseId: courseId,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Błąd podczas tworzenia sesji płatności:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas tworzenia sesji płatności' },
      { status: 500 }
    )
  }
} 