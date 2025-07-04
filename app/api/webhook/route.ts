import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    console.log('Otrzymano webhook od Stripe')
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      console.error('Brak podpisu Stripe')
      return NextResponse.json(
        { error: 'Brak podpisu Stripe' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('Webhook zweryfikowany pomyślnie')
    } catch (err) {
      console.error('Błąd weryfikacji webhooka:', err)
      return NextResponse.json(
        { error: 'Nieprawidłowy podpis webhooka' },
        { status: 400 }
      )
    }

    console.log('Typ eventu:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Dane sesji:', {
        id: session.id,
        metadata: session.metadata,
        amount_total: session.amount_total,
      })

      // Pobierz kurs, aby uzyskać jego cenę
      const course = await prisma.course.findUnique({
        where: { id: session.metadata?.courseId! },
      })

      if (!course) {
        console.error('Kurs nie został znaleziony:', session.metadata?.courseId)
        return NextResponse.json(
          { error: 'Kurs nie został znaleziony' },
          { status: 400 }
        )
      }

      console.log('Znaleziony kurs:', {
        id: course.id,
        title: course.title,
        price: course.price,
      })

      try {
        // Utwórz zamówienie w bazie danych
        const order = await prisma.order.create({
          data: {
            userId: session.metadata?.userId!,
            courseId: session.metadata?.courseId!,
            status: 'COMPLETED',
            amount: course.price,
            paymentId: session.id,
          },
        })

        console.log('Utworzone zamówienie:', {
          id: order.id,
          userId: order.userId,
          courseId: order.courseId,
          status: order.status,
          amount: order.amount,
        })

        // Zwróć sukces
        return NextResponse.json({ 
          success: true,
          orderId: order.id,
          message: 'Zamówienie utworzone pomyślnie'
        })
      } catch (error) {
        console.error('Błąd podczas tworzenia zamówienia:', error)
        return NextResponse.json(
          { error: 'Błąd podczas tworzenia zamówienia' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Błąd podczas przetwarzania webhooka:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania webhooka' },
      { status: 500 }
    )
  }
} 