// Konfiguracja EmailJS
export const EMAILJS_CONFIG = {
  // Service ID z EmailJS (np. 'service_abc123')
  SERVICE_ID: 'service_oxvnzqa',
  
  // Template ID z EmailJS dla zamówień autokaru (np. 'template_xyz789')
  TEMPLATE_ID: 'template_7abmyh1',
  
  // Template ID z EmailJS dla formularza kontaktowego
  CONTACT_TEMPLATE_ID: 'template_nlbcpx1',
  
  // Public Key z EmailJS (np. 'user_def456')
  PUBLIC_KEY: 'X6PM8hFUovvGKbz4U',
  
  // Adres email, na który będą przychodzić zamówienia autokaru
  TO_EMAIL: 'adradriaanoo@gmail.com',
  
  // Adres email, na który będą przychodzić wiadomości kontaktowe
  CONTACT_EMAIL: 'Trawers-adr@o2.pl'
}

// Template dla emaila z zamówieniem autokaru
export const createBusOrderTemplate = (data: {
  vehicleName: string
  vehicleCapacity: string
  kilometers: number
  pricePerKm: number
  totalPrice: number
  phoneNumber: string
  travelStartDate: string
  travelEndDate: string
}) => {
  return {
    to_email: EMAILJS_CONFIG.TO_EMAIL,
    vehicle_name: data.vehicleName,
    vehicle_capacity: data.vehicleCapacity,
    kilometers: data.kilometers.toString(),
    price_per_km: data.pricePerKm.toString(),
    total_price: data.totalPrice.toString(),
    phone_number: data.phoneNumber,
    travel_start_date: data.travelStartDate,
    travel_end_date: data.travelEndDate,
    message: `Nowe zamówienie autokaru:

Pojazd: ${data.vehicleName} (${data.vehicleCapacity})
Liczba kilometrów: ${data.kilometers} km
Cena za km: ${data.pricePerKm} zł
Cena całkowita: ${data.totalPrice} zł
Numer telefonu: ${data.phoneNumber}
Data wyjazdu: ${data.travelStartDate}
Data powrotu: ${data.travelEndDate}

Cena jest do negocjacji. Proszę o kontakt z klientem.`
  }
}

// Template dla emaila z formularza kontaktowego
export const createContactTemplate = (data: {
  name: string
  email: string
  pkk: string
  subject: string
  message: string
}) => {
  return {
    to_email: EMAILJS_CONFIG.CONTACT_EMAIL,
    name: data.name,
    email: data.email,
    pkk: data.pkk || 'Nie podano',
    subject: data.subject,
    message: data.message,
    full_message: `Nowa wiadomość kontaktowa:

Imię i nazwisko: ${data.name}
Email: ${data.email}
PKK: ${data.pkk || 'Nie podano'}
Temat: ${data.subject}

Wiadomość:
${data.message}`
  }
} 