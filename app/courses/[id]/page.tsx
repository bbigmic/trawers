'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { loadStripe } from '@stripe/stripe-js'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Course {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string | null
  videoUrl: string | null
}

export default function CourseDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`)
        if (!response.ok) {
          throw new Error('Nie udało się pobrać kursu')
        }
        const data = await response.json()
        setCourse(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  const handlePurchase = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: id }),
      })

      if (!response.ok) {
        throw new Error('Nie udało się utworzyć sesji płatności')
      }

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (!stripe) {
        throw new Error('Nie udało się załadować Stripe')
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas przetwarzania płatności')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Kurs nie został znaleziony</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Nagłówek kursu */}
            <div className="relative h-96">
              {course.videoUrl ? (
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={course.videoUrl} type="video/mp4" />
                  Twoja przeglądarka nie obsługuje odtwarzania wideo.
                </video>
              ) : course.imageUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A3D]/20 to-transparent backdrop-blur-[1px]" />
                </div>
              ) : (
                <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Brak zdjęcia</span>
                </div>
              )}
            </div>

            {/* Zawartość kursu */}
            <div className="px-6 py-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">{course.title}</h1>
                <div className="text-3xl font-bold text-[#FF7A3D]">{course.price} zł</div>
              </div>

              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <button
                    onClick={handlePurchase}
                    className="flex-1 bg-[#FF7A3D] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#FF5100] transition-colors flex items-center justify-center"
                    disabled
                  >
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Kup teraz i rozpocznij kurs
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/login')}
                    className="flex-1 bg-[#FF7A3D] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#FF5100] transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Zaloguj się, aby kupić kurs
                  </button>
                )}
                <button
                  onClick={() => router.back()}
                  className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Wróć do kursów
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 