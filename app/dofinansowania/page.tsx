'use client'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function DofinansowaniaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF7A3D] to-[#FF5100] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Zdobądź dofinansowanie za darmo
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Skorzystaj z funduszy europejskich i rozwijaj swoje umiejętności zawodowe
          </p>
        </div>
      </section>

      {/* Image Section */}
      <section className="w-full">
        <img
          src="/images/image-loga-dofinansowania.png"
          alt="Logo dofinansowania"
          className="w-full h-auto"
        />
      </section>

      {/* Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            
            {/* Project Introduction */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Zapraszamy do uczestnictwa w projekcie
              </h2>
              <p className="text-xl text-[#FF7A3D] font-semibold mb-4">
                „Zawodowa zielona transformacja" nr projektu FESL.05.04-IP.02-0815/23
              </p>
              <p className="text-lg text-gray-700 font-medium">
                Rekrutacja do projektu już się rozpoczęła! Zapraszamy do aplikowania!
              </p>
            </div>

            {/* Project Goal */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cel projektu</h3>
              <p className="text-gray-700 leading-relaxed">
                Celem projektu jest wsparcie w nabywaniu, podwyższaniu lub dostosowywaniu kwalifikacji i kompetencji zawodowych niezbędnych na rynku pracy. Projekt będzie realizowany na terenie woj. śląskiego w terminie od 2 IX 2024 r. do 31 VIII 2026 r.
              </p>
            </div>

            {/* Target Group */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Grupa docelowa</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Grupę docelową stanowi 90 pracujących osób z woj. śląskiego zatrudnionych na podstawie:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>umów krótkoterminowych lub umów cywilnoprawnych (75 osób),</li>
                <li>ubogich pracujących (13 osób),</li>
                <li>odchodzących z rolnictwa (2 osoby).</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Osoby stanowiące grupę docelową muszą z własnej inicjatywy chcieć podnieść swoje kwalifikacje zawodowe, jak również umiejętności związane z "Zieloną gospodarką" (kurs prawa jazdy kat. D lub np. szkolenia dające uprawnienia instalatora odnawialnych źródeł energii (OZE)).
              </p>
            </div>

            {/* Planned Effects */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Planowane efekty</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>nabycie kwalifikacji zawodowych przez min. 60% UP (54 osoby),</li>
                <li>nabycie umiejętności i wiedzy dot. zielonej gospodarki poprzez odpowiednio dobrane szkolenia zgodnie z potrzebami uczestników projektu.</li>
              </ul>
            </div>

            {/* Project Value */}
            <div className="bg-[#FFF0E8] rounded-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Wartość projektu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-lg font-semibold text-gray-700">Wartość projektu:</p>
                  <p className="text-2xl font-bold text-[#FF7A3D]">1 193 472,00 zł</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Wysokość dofinansowania z Funduszy Europejskich:</p>
                  <p className="text-2xl font-bold text-[#FF7A3D]">1 014 451,20 zł</p>
                </div>
              </div>
            </div>

            {/* Hashtags */}
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-4">
                <span className="bg-[#FF7A3D] text-white px-4 py-2 rounded-full font-semibold">
                  #FunduszeEuropejskie
                </span>
                <span className="bg-[#FF7A3D] text-white px-4 py-2 rounded-full font-semibold">
                  #FunduszeUE
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div className="border-t pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                INSTRUKCJA WYPEŁNIANIA FORMULARZA ZGŁOSZENIOWEGO
              </h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-3 ml-4">
                <li>NALEŻY WYPEŁNIĆ KOMPUTEROWO LUB DRUKOWANYMI LITERAMI</li>
                <li>WŁAŚCIWĄ ODPOWIEDZ NALEŻY ZAZNACZYĆ KRZYŻYKIEM.</li>
                <li>WYMAGANE JEST WYPEŁNIENIE WSZYSTKICH PÓL I UZUPEŁNIENIE WŁASNORĘCZNYCH, CZYTELNYCH PODPISÓW POD OŚWIADCZENIEM ZNAJDUJĄCYM SIĘ NA KOŃCU FORMULARZA.</li>
                <li>W MIEJSCACH W KTÓRYCH ZAKRES INFORMACJI/DANYCH NIE DOTYCZY OSOBY WYPEŁNIAJĄCEJ FORMULARZ, NALEŻY WPISAĆ "NIE DOTYCZY"</li>
              </ol>
            </div>

            {/* Documents Section */}
            <div className="border-t pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Dokumenty do pobrania</h3>
              
              {/* Regulamin */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Regulamin</h4>
                <a
                  href="/files/Regulamin-rekrutacji-5.4-Trawers-ADR.pdf"
                  download
                  className="inline-flex items-center bg-[#FF7A3D] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FF5100] transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Pobierz Regulamin (PDF)
                </a>
              </div>

              {/* Załączniki */}
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Załączniki</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="/files/Zalacznik-nr-1-do-regulaminu-naboru-do-projektu-TRAWERS (6).docx"
                    download
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#FF7A3D] hover:bg-[#FFF0E8] transition-colors"
                  >
                    <svg className="w-8 h-8 text-[#FF7A3D] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Załącznik nr 1</p>
                      <p className="text-sm text-gray-600">Formularz zgłoszeniowy</p>
                    </div>
                  </a>

                  <a
                    href="/files/Zalacznik-nr-2-do-regulaminu-naboru-do-projektu-TRAWERS-3 (1).docx"
                    download
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#FF7A3D] hover:bg-[#FFF0E8] transition-colors"
                  >
                    <svg className="w-8 h-8 text-[#FF7A3D] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Załącznik nr 2</p>
                      <p className="text-sm text-gray-600">Dokumenty rekrutacyjne</p>
                    </div>
                  </a>

                  <a
                    href="/files/Zalacznik-nr-5-do-regulaminu-naboru-do-projektu-TRAWERS-2 (2).docx"
                    download
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#FF7A3D] hover:bg-[#FFF0E8] transition-colors"
                  >
                    <svg className="w-8 h-8 text-[#FF7A3D] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Załącznik nr 5</p>
                      <p className="text-sm text-gray-600">Dodatkowe dokumenty</p>
                    </div>
                  </a>

                  <a
                    href="/files/Zal.-nr-7-Zakres-danych-osobowych-TRAWERS-5.4-2 (1).doc"
                    download
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-[#FF7A3D] hover:bg-[#FFF0E8] transition-colors"
                  >
                    <svg className="w-8 h-8 text-[#FF7A3D] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Załącznik nr 7</p>
                      <p className="text-sm text-gray-600">Zakres danych osobowych</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 