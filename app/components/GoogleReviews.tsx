import Image from 'next/image'
import { useState, useEffect } from 'react'

interface Review {
  author: string
  date: string
  rating: number
  content: string
  avatar: string
  language: string
}

interface GoogleReviewsData {
  reviews: Review[]
  rating: number
  total: number
}

export default function GoogleReviews() {
  const [reviewsData, setReviewsData] = useState<GoogleReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch('/api/google-reviews')
        if (!response.ok) throw new Error('Błąd podczas pobierania opinii')
        const data = await response.json()
        console.log('Wszystkie opinie:', data.reviews.map((r: Review) => ({
          author: r.author,
          rating: r.rating,
          content: r.content
        })))
        setReviewsData(data)
      } catch (err) {
        setError('Nie udało się pobrać opinii')
        console.error('Błąd:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7A3D]"></div>
        </div>
      </section>
    )
  }

  if (error || !reviewsData) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="text-center text-gray-600">
          {error || 'Nie udało się załadować opinii'}
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Opinie:</h2>
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <Image
                src="/images/Trawers-logo-biale-tlo-ikonka-300x169.png"
                alt="Trawers Logo"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div className="ml-4 text-left">
                <h3 className="font-semibold text-gray-900">Trawers-Adr - Specjalistyczne szkolenia transportowe. Szkolenia okresowe, kwalifikacja, kursy ADR, BHP</h3>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(reviewsData.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">{reviewsData.total} opinii Google</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsData.reviews.map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={review.avatar || '/images/default-avatar.png'}
                    alt={`${review.author} avatar`}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <h4 className="font-semibold text-gray-900">{review.author}</h4>
                    <Image
                      src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                      alt="Google icon"
                      width={20}
                      height={20}
                      className="ml-2"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(Number(review.date) * 1000).toLocaleDateString('pl-PL')}
                  </p>
                </div>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">{review.content}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://search.google.com/local/writereview?placeid=ChIJRXg623i1EEcR-ifqmPc9k-o"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#FF7A3D] hover:bg-[#FF5100]"
          >
            Napisz recenzję
          </a>
        </div>
      </div>
    </section>
  )
} 