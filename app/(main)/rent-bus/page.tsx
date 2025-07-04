'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import DatePicker, { registerLocale } from 'react-datepicker'
import { pl } from 'date-fns/locale'
import "react-datepicker/dist/react-datepicker.css"
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG, createBusOrderTemplate } from '@/lib/emailjs-config'

// Rejestracja polskiego locale
registerLocale('pl', pl)

// Dynamiczne importowanie komponentu mapy (aby uniknąć błędów SSR)
const Map = dynamic(() => import('@/components/Map'), { ssr: false })

interface Location {
  lat: number
  lng: number
  address: string
}

interface Route {
  distance: number
  duration: number
  polyline: google.maps.LatLngLiteral[]
}

interface Vehicle {
  id: string
  name: string
  capacity: string
  description: string
  pricePerKm: number
  imageUrl: string
}

const vehicles: Vehicle[] = [
  {
    id: 'bus19',
    name: 'Bus',
    capacity: '19+2',
    description: 'Komfortowy bus dla mniejszych grup',
    pricePerKm: 5.50,
    imageUrl: '/images/bus.png'
  },
  {
    id: 'bus48',
    name: 'Autokar',
    capacity: '48+2',
    description: 'Przestronny autokar dla dużych grup',
    pricePerKm: 7.50,
    imageUrl: '/images/autokar.png'
  }
]

interface TravelDates {
  startDate: Date | null
  endDate: Date | null
}

export default function RentBusPage() {
  const router = useRouter()
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [kilometers, setKilometers] = useState<number>(0)
  const [price, setPrice] = useState<number>(0)
  const [from, setFrom] = useState<Location | null>(null)
  const [to, setTo] = useState<Location | null>(null)
  const [waypoints, setWaypoints] = useState<Location[]>([])
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [travelStartDate, setTravelStartDate] = useState<Date | null>(null)
  const [travelEndDate, setTravelEndDate] = useState<Date | null>(null)
  const [dates, setDates] = useState<TravelDates>({
    startDate: null,
    endDate: null
  })

  const handleAddWaypoint = () => {
    setWaypoints([...waypoints, { lat: 0, lng: 0, address: '' }])
  }

  const handleRemoveWaypoint = (index: number) => {
    const newWaypoints = [...waypoints]
    newWaypoints.splice(index, 1)
    setWaypoints(newWaypoints)
  }

  const handleWaypointChange = (index: number, location: Location) => {
    console.log('Zmiana przystanku:', { index, location })
    const newWaypoints = [...waypoints]
    newWaypoints[index] = location
    setWaypoints(newWaypoints)
  }

  const calculatePrice = () => {
    if (selectedVehicle && kilometers > 0) {
      const totalPrice = kilometers * selectedVehicle.pricePerKm
      setPrice(Math.round(totalPrice))
    } else {
      setPrice(0)
    }
  }

  // Oblicz cenę gdy zmieni się pojazd lub liczba kilometrów
  useEffect(() => {
    calculatePrice()
  }, [selectedVehicle, kilometers])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVehicle || kilometers <= 0) {
      setError('Proszę wybrać pojazd i podać liczbę kilometrów')
      return
    }

    if (!phoneNumber.trim()) {
      setError('Proszę podać numer telefonu')
      return
    }

    if (!travelStartDate) {
      setError('Proszę wybrać datę wyjazdu')
      return
    }

    if (!travelEndDate) {
      setError('Proszę wybrać datę powrotu')
      return
    }

    if (travelStartDate >= travelEndDate) {
      setError('Data powrotu musi być późniejsza niż data wyjazdu')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Konfiguracja EmailJS
      const templateParams = createBusOrderTemplate({
        vehicleName: selectedVehicle.name,
        vehicleCapacity: selectedVehicle.capacity,
        kilometers: kilometers,
        pricePerKm: selectedVehicle.pricePerKm,
        totalPrice: price,
        phoneNumber: phoneNumber,
        travelStartDate: travelStartDate.toLocaleDateString('pl-PL'),
        travelEndDate: travelEndDate.toLocaleDateString('pl-PL')
      })

      // Wysyłanie emaila przez EmailJS
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      )

      if (result.status === 200) {
        setSuccess('Zamówienie zostało wysłane! Skontaktujemy się z Tobą wkrótce.')
        // Reset form
        setSelectedVehicle(null)
        setKilometers(0)
        setPhoneNumber('')
        setTravelStartDate(null)
        setTravelEndDate(null)
        setPrice(0)
      } else {
        throw new Error('Błąd podczas wysyłania zamówienia')
      }
    } catch (error) {
      console.error('EmailJS error:', error)
      setError('Wystąpił błąd podczas wysyłania zamówienia. Spróbuj ponownie lub skontaktuj się z nami telefonicznie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold mb-8">Wynajmij autokar</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Kalkulacja kosztów podróży</h3>
              <p className="text-blue-700 mb-2">
                Tutaj możesz obliczyć szacowany koszt podróży autokarem. Wybierz pojazd i podaj liczbę kilometrów, 
                a system automatycznie wyliczy przybliżoną cenę za usługę.
              </p>
              <p className="text-blue-700 font-medium">
                💡 <strong>Cena jest do negocjacji</strong> - skontaktuj się z nami, aby uzgodnić finalną kwotę 
                i szczegóły podróży.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Wybór pojazdu */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Wybierz pojazd</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedVehicle?.id === vehicle.id
                    ? 'border-[#FF7A3D] bg-[#FFF0E8]'
                    : 'border-gray-200 hover:border-[#FF7A3D]'
                }`}
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={vehicle.imageUrl}
                      alt={vehicle.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                    <p className="text-gray-600">Miejsca: {vehicle.capacity}</p>
                    <p className="text-gray-600">{vehicle.description}</p>
                    <p className="text-sm font-medium text-[#FF7A3D] mt-1">
                      {vehicle.pricePerKm} zł/km
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liczba kilometrów */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Podaj liczbę kilometrów</h2>
          <div className="max-w-md">
            <label htmlFor="kilometers" className="input-label">
              Liczba kilometrów
            </label>
            <input
              type="number"
              id="kilometers"
              className="input-field"
              placeholder="Wprowadź liczbę kilometrów"
              value={kilometers || ''}
              onChange={(e) => setKilometers(Number(e.target.value) || 0)}
              min="0"
              step="0.1"
            />
          </div>
        </div>

        {/* Dane kontaktowe i daty podróży */}
        {selectedVehicle && kilometers > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Dane kontaktowe i daty podróży</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="phoneNumber" className="input-label">
                  Numer telefonu *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="input-field"
                  placeholder="np. 123 456 789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="travelStartDate" className="input-label">
                  Data wyjazdu *
                </label>
                <DatePicker
                  id="travelStartDate"
                  selected={travelStartDate}
                  onChange={(date: Date | null) => setTravelStartDate(date)}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  locale="pl"
                  placeholderText="Wybierz datę wyjazdu"
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="travelEndDate" className="input-label">
                  Data powrotu *
                </label>
                <DatePicker
                  id="travelEndDate"
                  selected={travelEndDate}
                  onChange={(date: Date | null) => setTravelEndDate(date)}
                  minDate={travelStartDate || new Date()}
                  dateFormat="dd/MM/yyyy"
                  locale="pl"
                  placeholderText="Wybierz datę powrotu"
                  className="input-field w-full"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Podsumowanie i cena */}
        {selectedVehicle && kilometers > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Podsumowanie</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pojazd:</span>
                  <span className="font-semibold">{selectedVehicle.name} ({selectedVehicle.capacity})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Liczba kilometrów:</span>
                  <span className="font-semibold">{kilometers} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cena za km:</span>
                  <span className="font-semibold">{selectedVehicle.pricePerKm} zł</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Cena całkowita:</span>
                    <span className="text-2xl font-bold text-[#FF7A3D]">{price} zł</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Przycisk zamówienia */}
        {selectedVehicle && kilometers > 0 && phoneNumber.trim() && travelStartDate && travelEndDate && (
          <div className="mb-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full max-w-md bg-[#FF7A3D] text-white px-6 py-3 rounded-lg hover:bg-[#FF5100] transition-colors disabled:opacity-50 font-semibold text-lg"
            >
              {loading ? 'Wysyłanie zamówienia...' : 'Wyślij zamówienie'}
            </button>
          </div>
        )}

        {/* Ukryte sekcje - do późniejszego wykorzystania */}
        {/* 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="from" className="input-label">
                Skąd
              </label>
              <input
                type="text"
                id="from"
                className="input-field"
                placeholder="Wprowadź adres początkowy"
                value={from?.address || ''}
                onChange={() => {}}
              />
            </div>

            {waypoints.map((waypoint, index) => (
              <div key={index} className="relative">
                <label htmlFor={`waypoint-${index}`} className="input-label">
                  Przystanek {index + 1}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id={`waypoint-${index}`}
                    className="input-field flex-1"
                    placeholder={`Wprowadź adres przystanku ${index + 1}`}
                    value={waypoint.address}
                    onChange={() => {}}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveWaypoint(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                    aria-label="Usuń przystanek"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddWaypoint}
              className="w-full py-2 px-4 border border-[#FF7A3D] text-[#FF7A3D] rounded-lg hover:bg-[#FFF0E8] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj przystanek
            </button>

            <div>
              <label htmlFor="to" className="input-label">
                Dokąd
              </label>
              <input
                type="text"
                id="to"
                className="input-field"
                placeholder="Wprowadź adres końcowy"
                value={to?.address || ''}
                onChange={() => {}}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Daty podróży</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="input-label">
                    Data wyjazdu
                  </label>
                  <DatePicker
                    id="startDate"
                    selected={dates.startDate}
                    onChange={(date: Date | null) => setDates(prev => ({ ...prev, startDate: date }))}
                    selectsStart
                    startDate={dates.startDate}
                    endDate={dates.endDate}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    locale="pl"
                    placeholderText="Wybierz datę wyjazdu"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="input-label">
                    Data powrotu
                  </label>
                  <DatePicker
                    id="endDate"
                    selected={dates.endDate}
                    onChange={(date: Date | null) => setDates(prev => ({ ...prev, endDate: date }))}
                    selectsEnd
                    startDate={dates.startDate}
                    endDate={dates.endDate}
                    minDate={dates.startDate || new Date()}
                    dateFormat="dd/MM/yyyy"
                    locale="pl"
                    placeholderText="Wybierz datę powrotu"
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>

            {route && selectedVehicle && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Szczegóły trasy:</h3>
                <p>Pojazd: {selectedVehicle.name} ({selectedVehicle.capacity})</p>
                <p>Dystans: {(route.distance / 1000).toFixed(2)} km</p>
                <p>Czas podróży: {Math.round(route.duration / 60)} minut</p>
                <p>Liczba przystanków: {waypoints.length}</p>
                {dates.startDate && dates.endDate && (
                  <p>Termin: {dates.startDate.toLocaleDateString('pl')} - {dates.endDate.toLocaleDateString('pl')}</p>
                )}
                <p className="text-xl font-bold mt-2">Cena: {price} zł</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !route || !selectedVehicle || !dates.startDate || !dates.endDate}
              className="w-full bg-[#FF7A3D] text-white px-4 py-2 rounded-lg hover:bg-[#FF5100] transition-colors disabled:opacity-50"
            >
              {loading ? 'Przetwarzanie...' : 'Zamów autokar'}
            </button>
          </div>

          <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg" style={{ minHeight: '500px' }}>
            <Map
              from={from}
              to={to}
              waypoints={waypoints}
              onFromChange={setFrom}
              onToChange={setTo}
              onWaypointChange={handleWaypointChange}
              onRouteChange={setRoute}
            />
          </div>
        </div>
        */}
      </div>
    </div>
  )
} 