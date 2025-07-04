import { NextResponse } from 'next/server'

const PLACE_ID = 'ChIJRXg623i1EEcR-ifqmPc9k-o' // ID Twojej firmy z Google Places
const API_KEY = process.env.GOOGLE_PLACES_API_KEY

export async function GET() {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${API_KEY}&language=pl`
    )

    if (!response.ok) {
      throw new Error('Błąd podczas pobierania opinii')
    }

    const data = await response.json()
    
    const reviews = data.result.reviews.map((review: any) => ({
      author: review.author_name,
      date: review.time,
      rating: review.rating,
      content: review.text,
      avatar: review.profile_photo_url,
      language: review.language || 'pl' // Domyślnie 'pl' jeśli nie określono
    }))

    // Sortujemy opinie po dacie (od najnowszych) i wybieramy tylko te z 5 gwiazdkami
    const sortedReviews = reviews
      .sort((a: any, b: any) => b.date - a.date)
      .filter((review: any) => review.rating === 5)
      .slice(0, 3)

    return NextResponse.json({
      reviews: sortedReviews,
      rating: data.result.rating,
      total: data.result.user_ratings_total
    })
  } catch (error) {
    console.error('Błąd:', error)
    return NextResponse.json(
      { error: 'Nie udało się pobrać opinii' },
      { status: 500 }
    )
  }
} 