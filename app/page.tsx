'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import GoogleReviews from './components/GoogleReviews'

interface Course {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string | null
  videoUrl: string | null
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    try {
      const res = await fetch('/api/courses')
      if (!res.ok) throw new Error('Błąd podczas pobierania kursów')
      const data = await res.json()
      setCourses(data)
    } catch (err) {
      console.error('Błąd:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden min-h-[80vh]">
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero-bg2.mov" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-[#FF7A3D]/40 to-black/60 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
          <div className="text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] [text-shadow:_0_4px_0_rgb(0_0_0_/_60%)]">
              Szkolenia dla kierowców zawodowych
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] [text-shadow:_0_2px_0_rgb(0_0_0_/_60%)]">
              Firma Trawers-Adr jest obecna na rynku już od wielu lat. Mamy do dyspozycji sale wykładowe, place manewrowe oraz własną flotę pojazdów. Oferujemy kursy ADR, szkolenia okresowe, doradztwo ADR i wiele więcej.
            </p>
            <Link
              href="#courses"
              className="inline-block bg-white text-[#FF7A3D] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-[#FF7A3D]"
            >
              Rozpocznij Naukę
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Dlaczego Warto Wybrać Trawers?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-[#FFF0E8] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#FF7A3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Praktyczna Wiedza</h3>
              <p className="text-gray-600">
                Nasze kursy są tworzone przez ekspertów z wieloletnim doświadczeniem
                w branży. Uczysz się tego, co naprawdę przydaje się w pracy.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-[#FFF0E8] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#FF7A3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Elastyczne Nauczanie</h3>
              <p className="text-gray-600">
                Ucz się w swoim tempie, o dowolnej porze. Materiały są dostępne
                24/7, a Ty decydujesz kiedy chcesz się uczyć.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-[#FFF0E8] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#FF7A3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Wsparcie Wykładowców</h3>
              <p className="text-gray-600">
                Nasi wykładowcy są zawsze gotowi pomóc Ci w rozwiązaniu problemów
                i odpowiedzieć na Twoje pytania.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              >
                <source src="/videos/sala-komputerowa.mov" type="video/mp4" />
              </video>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF7A3D]/20 to-transparent backdrop-blur-[1px]"></div>
            </div>
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-gray-900">Co nas wyróżnia?</h2>
              <h3 className="text-4xl font-bold text-gray-900">
                Prowadzone przez nas wykłady są prowadzone w niezwykle ciekawej, cechującej się prostotą i łatwością formie.
              </h3>
              <p className="text-xl text-gray-600">Naszymi głównymi priorytetami jest przede wszystkim:</p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-[#FF7A3D] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg text-gray-700">Przekazanie praktycznej wiedzy</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-[#FF7A3D] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg text-gray-700">Wyuczenie odruchów bezwarunkowych, które są niezbędne dla profesjonalnego kierowcy</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-[#FF7A3D] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg text-gray-700">Kompleksową edukację z dziedziny kodeksu drogowego bazując na realnych przykładach</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-[#FF7A3D] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg text-gray-700">Indywidualne podejście do każdego uczestnika kursu, w zależności od potrzeb i umiejętności</span>
                </li>
              </ul>
              <Link
                href="/about"
                className="inline-flex items-center text-[#FF7A3D] font-semibold hover:text-[#FF5100] transition-colors"
              >
                O nas
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nasza Oferta
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7A3D]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.slice(0, 6).map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-48">
                      {course.videoUrl ? (
                        <video
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        >
                          <source src={course.videoUrl} type="video/mp4" />
                        </video>
                      ) : course.imageUrl ? (
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">Brak zdjęcia</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#FF7A3D] transition-colors">
                        {course.title}
                      </h3>
                      <p className="mt-2 text-gray-500 line-clamp-3">
                        {course.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-[#FF7A3D]">
                          {course.price} zł
                        </span>
                        <span className="text-sm text-gray-500 group-hover:text-[#FF7A3D] transition-colors">
                          Dowiedz się więcej →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {courses.length > 6 && (
                <div className="text-center mt-12">
                  <Link
                    href="/courses"
                    className="inline-flex items-center bg-[#FF7A3D] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#FF5100] transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Zobacz więcej kursów
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Sekcja opinii Google */}
      <GoogleReviews />

      <Footer />
    </div>
  )
} 