import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import emailjs from '@emailjs/browser'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    // Konfiguracja transportera email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Wysyłanie emaila
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `Nowa wiadomość kontaktowa: ${subject}`,
      text: `
        Imię i nazwisko: ${name}
        Email: ${email}
        Temat: ${subject}
        
        Wiadomość:
        ${message}
      `,
      html: `
        <h2>Nowa wiadomość kontaktowa</h2>
        <p><strong>Imię i nazwisko:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temat:</strong> ${subject}</p>
        <p><strong>Wiadomość:</strong></p>
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ message: 'Wiadomość została wysłana' })
  } catch (error) {
    console.error('Błąd podczas wysyłania wiadomości:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania wiadomości' },
      { status: 500 }
    )
  }
} 