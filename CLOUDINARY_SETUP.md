# Konfiguracja Cloudinary

## 1. Utwórz konto na Cloudinary

1. Przejdź na [cloudinary.com](https://cloudinary.com)
2. Zarejestruj się za darmowe konto
3. Po rejestracji otrzymasz:
   - Cloud Name
   - API Key
   - API Secret

## 2. Dodaj zmienne środowiskowe

Dodaj następujące zmienne do pliku `.env.local`:

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 3. Konfiguracja Upload Preset (opcjonalnie)

Dla lepszej kontroli nad uploadem możesz utworzyć Upload Preset:

1. Przejdź do Dashboard > Settings > Upload
2. Utwórz nowy Upload Preset
3. Ustaw folder na `trawers`
4. Włącz "Signing Mode" jeśli chcesz podpisywać uploady

## 4. Limity darmowego planu

- **25 GB** miejsca
- **25 GB** transferu/miesiąc
- **Obrazy**: max 10 MB
- **Wideo**: max 100 MB
- **Dokumenty**: max 100 MB

## 5. Struktura folderów w Cloudinary

Pliki będą organizowane w następujących folderach:
- `trawers/courses/` - obrazy kursów
- `trawers/courses/videos/` - wideo kursów
- `trawers/documents/` - dokumenty użytkowników

## 6. Funkcje

### Upload obrazów
- Automatyczne resize do 1200x800
- Optymalizacja jakości
- Format: JPG, PNG, GIF, WebP, SVG, BMP

### Upload wideo
- Automatyczne resize do 1280x720
- Optymalizacja jakości
- Format: MP4, AVI, MOV, WMV, FLV, WebM, MKV

### Upload dokumentów
- Bez transformacji
- Format: PDF, DOC, DOCX, XLS, XLSX, TXT, ZIP, etc.

## 7. Bezpieczeństwo

- Wszystkie pliki są przechowywane w chmurze
- Automatyczne kopie zapasowe
- CDN dla szybkiego dostępu
- HTTPS dla wszystkich połączeń

## 8. Monitoring

Możesz monitorować użycie w Dashboard Cloudinary:
- Ilość przechowywanych plików
- Transfer danych
- Statystyki użycia 