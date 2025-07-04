import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolumna 1 - Dane kontaktowe */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Trawers Adr</h3>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Adres</h4>
              <p className="text-gray-600">
                Kilińskiego 16 lokal 17 (w podwórzu),<br />
                42-200 Częstochowa
              </p>
              <div className="mt-4">
                <h4 className="font-medium text-gray-900">Zadzwoń</h4>
                <p className="text-gray-600">+48 34 361 54 67</p>
                <p className="text-gray-600 mb-8">+48 535 595 181</p>
              </div>
              <div className="flex space-x-4 mt-8">
                <a
                  href="https://www.facebook.com/TrawersADR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF7A3D] hover:text-[#FF5100]"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
                  </svg>
                </a>
                <a
                  href="https://www.google.com/search?q=Trawers+ADR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF7A3D] hover:text-[#FF5100]"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Kolumna 2 - Godziny otwarcia */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Godziny otwarcia</h3>
            <div className="space-y-2 text-gray-600">
              <p>Poniedziałek : 8:00 – 17:00</p>
              <p>Wtorek : 8:00 – 17:00</p>
              <p>Środa : 8:00 – 17:00</p>
              <p>Czwartek : 8:00 – 17:00</p>
              <p>Piątek : 8:00 – 17:00</p>
              <p>Sobota : 8:00 – 12:00</p>
              <p>Niedziela – Zamknięte</p>
            </div>
          </div>

          {/* Kolumna 3 - Logo */}
          <div className="flex justify-center md:justify-end items-start">
            <Image
              src="/images/Trawers-bez-tla.png"
              alt="Trawers ADR Logo"
              width={400}
              height={225}
              className="w-[400px] h-auto"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              Copyright © 2025 Trawers Adr Częstochowa | Powered by Trawers Adr Częstochowa
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 