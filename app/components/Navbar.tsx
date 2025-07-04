'use client'

import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Navbar() {
  const { user, loading } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleProfileClick = () => {
    setIsProfileMenuOpen(false)
    setIsMobileMenuOpen(false)
    router.push('/profile')
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
    setIsProfileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/Trawers-logo-biale-tlo-ikonka-300x169.png"
                  alt="Trawers Logo"
                  width={250}
                  height={101}
                  className="h-16 w-auto"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/courses"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Kursy i szkolenia
              </Link>
              <Link
                href="/rent-bus"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Wynajmij autokar
              </Link>
              <Link
                href="/dofinansowania"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dofinansowania
              </Link>
              <Link
                href="/about"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                O nas
              </Link>
              <Link
                href="/contact"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Kontakt
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {loading ? (
              <div className="text-gray-500">Ładowanie...</div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="ml-2">{user.email}</span>
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl z-50">
                      <button
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profil
                      </button>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Zamówienia
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Panel Admina
                        </Link>
                      )}
                      <button
                        onClick={async () => {
                          await fetch('/api/auth/logout', { method: 'POST' })
                          window.location.href = '/'
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Wyloguj
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Zaloguj się
                </Link>
                <Link
                  href="/register"
                  className="bg-[#FF7A3D] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#FF5100]"
                >
                  Zarejestruj się
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FF7A3D]"
              aria-expanded="false"
            >
              <span className="sr-only">Otwórz menu główne</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <Link
            href="/courses"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-[#FF7A3D]"
            onClick={handleMobileMenuClose}
          >
            Kursy i szkolenia
          </Link>
          <Link
            href="/rent-bus"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-[#FF7A3D]"
            onClick={handleMobileMenuClose}
          >
            Wynajmij autokar
          </Link>
          <Link
            href="/dofinansowania"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-[#FF7A3D]"
            onClick={handleMobileMenuClose}
          >
            Dofinansowania
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-[#FF7A3D]"
            onClick={handleMobileMenuClose}
          >
            O nas
          </Link>
          <Link
            href="/contact"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-[#FF7A3D]"
            onClick={handleMobileMenuClose}
          >
            Kontakt
          </Link>
        </div>

        {/* Mobile auth section */}
        <div className="pt-4 pb-3 border-t border-gray-200 bg-white">
          {loading ? (
            <div className="px-3 py-2 text-gray-500">Ładowanie...</div>
          ) : user ? (
            <div className="space-y-1">
              <div className="px-3 py-2 text-sm font-medium text-gray-500">
                {user.email}
              </div>
              <Link
                href="/profile"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={handleMobileMenuClose}
              >
                Profil
              </Link>
              <Link
                href="/orders"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={handleMobileMenuClose}
              >
                Zamówienia
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={handleMobileMenuClose}
                >
                  Panel Admina
                </Link>
              )}
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  window.location.href = '/'
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Wyloguj
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <Link
                href="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={handleMobileMenuClose}
              >
                Zaloguj się
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 text-base font-medium text-[#FF7A3D] hover:text-[#FF5100] hover:bg-gray-50"
                onClick={handleMobileMenuClose}
              >
                Zarejestruj się
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
} 