'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

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

interface MapProps {
  from: Location | null
  to: Location | null
  waypoints: Location[]
  onFromChange: (location: Location) => void
  onToChange: (location: Location) => void
  onWaypointChange: (index: number, location: Location) => void
  onRouteChange: (route: Route | null) => void
}

export default function Map({ 
  from, 
  to, 
  waypoints,
  onFromChange, 
  onToChange,
  onWaypointChange, 
  onRouteChange 
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  const fromAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const toAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const waypointAutocompletesRef = useRef<(google.maps.places.Autocomplete | null)[]>([])

  const setupAutocomplete = useCallback((input: HTMLInputElement, type: 'from' | 'to' | number) => {
    const autocomplete = new google.maps.places.Autocomplete(input, {
      fields: ['formatted_address', 'geometry'],
      componentRestrictions: { country: 'pl' }
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place.geometry?.location && place.formatted_address) {
        const location: Location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address
        }
        if (type === 'from') {
          onFromChange(location)
        } else if (type === 'to') {
          onToChange(location)
        } else if (typeof type === 'number') {
          onWaypointChange(type, location)
        }
      }
    })

    if (type === 'from') {
      fromAutocompleteRef.current = autocomplete
    } else if (type === 'to') {
      toAutocompleteRef.current = autocomplete
    } else if (typeof type === 'number') {
      waypointAutocompletesRef.current[type] = autocomplete
    }
  }, [onFromChange, onToChange, onWaypointChange])

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places'],
      })

      try {
        const google = await loader.load()
        
        if (mapRef.current && !mapInstanceRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 52.2297, lng: 21.0122 }, // Warszawa
            zoom: 8,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true
          })

          mapInstanceRef.current = map

          // Inicjalizacja DirectionsRenderer
          const directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#4F46E5',
              strokeWeight: 4,
              strokeOpacity: 1.0
            }
          })

          directionsRenderer.setMap(map)
          directionsRendererRef.current = directionsRenderer

          // Dodaj markery
          const markers = [
            new google.maps.Marker({
              map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4F46E5',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              },
            }),
            ...waypoints.map(() => new google.maps.Marker({
              map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: '#818CF8',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              },
            })),
            new google.maps.Marker({
              map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#EF4444',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              },
            }),
          ]

          markersRef.current = markers
        }

        // Inicjalizacja lub aktualizacja autocomplete dla pól input
        const fromInput = document.getElementById('from') as HTMLInputElement
        const toInput = document.getElementById('to') as HTMLInputElement
        const waypointInputs = waypoints.map((_, index) => 
          document.getElementById(`waypoint-${index}`) as HTMLInputElement
        )

        if (fromInput && !fromAutocompleteRef.current) {
          setupAutocomplete(fromInput, 'from')
        }
        if (toInput && !toAutocompleteRef.current) {
          setupAutocomplete(toInput, 'to')
        }

        // Aktualizuj autouzupełnianie dla przystanków
        waypointInputs.forEach((input, index) => {
          if (input && !waypointAutocompletesRef.current[index]) {
            setupAutocomplete(input, index)
          }
        })

      } catch (error) {
        console.error('Błąd podczas ładowania mapy:', error)
      }
    }

    initMap()
  }, [setupAutocomplete, waypoints])

  // Dodaj efekt do czyszczenia nieużywanych markerów i autouzupełnień
  useEffect(() => {
    // Usuń nadmiarowe markery
    if (markersRef.current.length > waypoints.length + 2) {
      const markersToRemove = markersRef.current.slice(waypoints.length + 2)
      markersToRemove.forEach(marker => marker.setMap(null))
      markersRef.current = markersRef.current.slice(0, waypoints.length + 2)
    }

    // Dodaj nowe markery jeśli potrzeba
    if (markersRef.current.length < waypoints.length + 2 && mapInstanceRef.current) {
      const map = mapInstanceRef.current
      const newMarkers = Array(waypoints.length + 2 - markersRef.current.length).fill(null).map(() => 
        new google.maps.Marker({
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: '#818CF8',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        })
      )
      markersRef.current = [...markersRef.current, ...newMarkers]
    }

    // Wyczyść nieużywane autouzupełnienia
    waypointAutocompletesRef.current = waypointAutocompletesRef.current.slice(0, waypoints.length)
  }, [waypoints.length])

  useEffect(() => {
    if (!from || !to || !mapInstanceRef.current || !directionsRendererRef.current) {
      return
    }

    const directionsService = new google.maps.DirectionsService()
    const map = mapInstanceRef.current
    const directionsRenderer = directionsRendererRef.current
    const markers = markersRef.current

    // Ustaw pozycje markerów
    markers[0].setPosition({ lat: from.lat, lng: from.lng })
    waypoints.forEach((waypoint, index) => {
      if (waypoint.lat !== 0 && waypoint.lng !== 0) {
        markers[index + 1].setPosition({ lat: waypoint.lat, lng: waypoint.lng })
      }
    })
    markers[markers.length - 1].setPosition({ lat: to.lat, lng: to.lng })

    // Filtruj nieprawidłowe przystanki
    const validWaypoints = waypoints.filter(wp => wp.lat !== 0 && wp.lng !== 0)

    const request = {
      origin: { lat: from.lat, lng: from.lng },
      destination: { lat: to.lat, lng: to.lng },
      waypoints: validWaypoints.map(waypoint => ({
        location: { lat: waypoint.lat, lng: waypoint.lng },
        stopover: true
      })),
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING,
    }

    directionsService.route(request, (result, status) => {
      if (status === 'OK' && result) {
        // Wyczyść poprzednią trasę
        directionsRenderer.setMap(null)
        
        // Ustaw nową trasę
        directionsRenderer.setMap(map)
        directionsRenderer.setDirections(result)

        const route = result.routes[0]
        if (route.legs) {
          const totalDistance = route.legs.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0)
          const totalDuration = route.legs.reduce((sum, leg) => sum + (leg.duration?.value || 0), 0)
          const points = route.overview_path.map(point => ({
            lat: point.lat(),
            lng: point.lng()
          }))

          onRouteChange({
            distance: totalDistance,
            duration: totalDuration,
            polyline: points
          })

          // Dostosuj widok mapy do trasy
          const bounds = new google.maps.LatLngBounds()
          route.legs.forEach(leg => {
            bounds.extend(leg.start_location)
            bounds.extend(leg.end_location)
          })
          
          // Użyj setTimeout, aby dać mapie czas na renderowanie
          setTimeout(() => {
            map.fitBounds(bounds)
          }, 200)
        }
      } else {
        console.error('Błąd podczas obliczania trasy:', status)
        onRouteChange(null)
      }
    })
  }, [from, to, waypoints, onRouteChange])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full relative" 
      style={{ 
        minHeight: '500px',
        aspectRatio: '16/9'
      }}
    />
  )
} 