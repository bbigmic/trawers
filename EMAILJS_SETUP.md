# Konfiguracja EmailJS dla zamówień autokaru i formularza kontaktowego

## Krok 1: Utwórz konto w EmailJS
1. Przejdź na https://www.emailjs.com/
2. Zarejestruj się i zaloguj do panelu

## Krok 2: Skonfiguruj Email Service
1. W panelu EmailJS przejdź do "Email Services"
2. Kliknij "Add New Service"
3. Wybierz swojego dostawcę email (Gmail, Outlook, etc.)
4. Skonfiguruj połączenie i zapisz Service ID

## Krok 3: Utwórz Email Templates

### Template dla zamówień autokaru:
1. Przejdź do "Email Templates"
2. Kliknij "Create New Template"
3. Skonfiguruj template z następującymi zmiennymi:
   - `{{to_email}}` - adres email odbiorcy
   - `{{vehicle_name}}` - nazwa pojazdu
   - `{{vehicle_capacity}}` - pojemność pojazdu
   - `{{kilometers}}` - liczba kilometrów
   - `{{price_per_km}}` - cena za kilometr
   - `{{total_price}}` - cena całkowita
   - `{{phone_number}}` - numer telefonu klienta
   - `{{travel_start_date}}` - data wyjazdu
   - `{{travel_end_date}}` - data powrotu
   - `{{message}}` - pełna wiadomość

4. Zapisz template i skopiuj Template ID

### Template dla formularza kontaktowego:
1. Utwórz kolejny template klikając "Create New Template"
2. Skonfiguruj template z następującymi zmiennymi:
   - `{{to_email}}` - adres email odbiorcy
   - `{{name}}` - imię i nazwisko
   - `{{email}}` - adres email nadawcy
   - `{{pkk}}` - numer PKK (opcjonalny)
   - `{{subject}}` - temat wiadomości
   - `{{message}}` - treść wiadomości
   - `{{full_message}}` - pełna wiadomość sformatowana

3. Zapisz template i skopiuj Template ID

## Krok 4: Skopiuj Public Key
1. W panelu EmailJS przejdź do "Account" → "API Keys"
2. Skopiuj Public Key

## Krok 5: Zaktualizuj konfigurację
1. Otwórz plik `app/lib/emailjs-config.ts`
2. Zastąp placeholder-y właściwymi wartościami:
   ```typescript
   export const EMAILJS_CONFIG = {
     SERVICE_ID: 'twój_service_id', // np. 'service_abc123'
     TEMPLATE_ID: 'twój_template_id', // np. 'template_xyz789' (dla autokaru)
     CONTACT_TEMPLATE_ID: 'twój_contact_template_id', // np. 'template_abc456' (dla kontaktu)
     PUBLIC_KEY: 'twój_public_key', // np. 'user_def456'
     TO_EMAIL: 'adradriaanoo@gmail.com', // email dla zamówień autokaru
     CONTACT_EMAIL: 'kontakt@trawers.pl' // email dla wiadomości kontaktowych
   }
   ```

## Przykładowe Email Templates

### Template dla zamówień autokaru:
```html
<h2>Nowe zamówienie autokaru</h2>

<p><strong>Pojazd:</strong> {{vehicle_name}} ({{vehicle_capacity}})</p>
<p><strong>Liczba kilometrów:</strong> {{kilometers}} km</p>
<p><strong>Cena za km:</strong> {{price_per_km}} zł</p>
<p><strong>Cena całkowita:</strong> {{total_price}} zł</p>
<p><strong>Numer telefonu:</strong> {{phone_number}}</p>
<p><strong>Data wyjazdu:</strong> {{travel_start_date}}</p>
<p><strong>Data powrotu:</strong> {{travel_end_date}}</p>

<p><em>Cena jest do negocjacji. Proszę o kontakt z klientem.</em></p>
```

### Template dla formularza kontaktowego:
```html
<h2>Nowa wiadomość kontaktowa</h2>

<p><strong>Imię i nazwisko:</strong> {{name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>PKK:</strong> {{pkk}}</p>
<p><strong>Temat:</strong> {{subject}}</p>

<p><strong>Wiadomość:</strong></p>
<p>{{message}}</p>
```

## Testowanie

### Testowanie zamówień autokaru:
1. Uruchom aplikację w trybie deweloperskim
2. Przejdź do strony "Wynajmij autokar"
3. Wypełnij formularz i wyślij zamówienie
4. Sprawdź czy email dotarł na adres `adradriaanoo@gmail.com`

### Testowanie formularza kontaktowego:
1. Przejdź do strony "Kontakt"
2. Wypełnij formularz kontaktowy (imię, email, PKK, temat, wiadomość)
3. Wyślij wiadomość
4. Sprawdź czy email dotarł na adres `kontakt@trawers.pl`

## Uwagi
- Upewnij się, że wszystkie klucze są poprawnie skonfigurowane
- Sprawdź czy adres email w `TO_EMAIL` jest prawidłowy
- W przypadku problemów sprawdź konsolę przeglądarki pod kątem błędów EmailJS 