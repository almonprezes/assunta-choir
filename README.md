# Chór Assunta - Strona internetowa

Kompletna strona internetowa dla Parafialnego Chóru "Assunta" z backendem i frontendem.

## Funkcjonalności

### Frontend (dla publiczności)
- **Strona główna** - informacje o chórze, najnowsze wydarzenia
- **Koncerty** - kalendarz nadchodzących koncertów
- **O chórze** - historia, misja i informacje o zespole
- **Rejestracja** - formularz dla nowych członków

### Backend (strefa członkowska)
- **Panel użytkownika** - personalizowany dashboard
- **Próby** - terminarz prób z informacjami o lokalizacji i czasie trwania
- **Nagrania** - biblioteka nagrań audio z prób i koncertów
- **Partytury** - udostępnianie nut i materiałów muzycznych
- **Członkowie** - zarządzanie członkami (dla administratorów)
- **System uwierzytelniania** - bezpieczne logowanie i rejestracja

## Technologia

### Backend
- **Node.js** z **Express.js**
- **SQLite** jako baza danych
- **JWT** do autentykacji
- **Multer** do uploadu plików
- **bcryptjs** do hashowania haseł

### Frontend
- **React 18** z **React Router**
- **Tailwind CSS** do stylizacji
- **React Query** do zarządzania stanem
- **Lucide React** do ikon
- **Axios** do komunikacji z API

## Instalacja

### Krok 1: Zainstaluj zależności
```bash
npm run install-all
```

### Krok 2: Skonfiguruj backend
```bash
cd backend
cp .env.example .env
# Edytuj plik .env i ustaw swoje zmienne środowiskowe
```

### Krok 3: Uruchom aplikację
```bash
# Z głównego katalogu
npm run dev
```

Alternatywnie, uruchom serwery osobno:
```bash
# Backend (terminal 1)
npm run server

# Frontend (terminal 2)
npm run client
```

## Struktura projektu

```
windsurf-project/
├── backend/                 # API serwera
│   ├── routes/             # Endpointy API
│   ├── uploads/            # Przesłane pliki
│   ├── database.js         # Konfiguracja bazy danych
│   └── index.js            # Główny plik serwera
├── frontend/               # Aplikacja React
│   ├── src/
│   │   ├── components/     # Komponenty React
│   │   ├── pages/          # Strony aplikacji
│   │   ├── contexts/       # Konteksty React
│   │   └── App.js          # Główny komponent
│   └── public/             # Pliki statyczne
└── package.json            # Główny plik package.json
```

## API Endpoints

### Autentykacja
- `POST /api/auth/register` - Rejestracja użytkownika
- `POST /api/auth/login` - Logowanie użytkownika

### Koncerty
- `GET /api/concerts` - Pobierz koncerty (publiczne)
- `POST /api/concerts` - Dodaj koncert (wymaga logowania)
- `PUT /api/concerts/:id` - Aktualizuj koncert
- `DELETE /api/concerts/:id` - Usuń koncert

### Próby (wymagają logowania)
- `GET /api/rehearsals` - Pobierz próby
- `POST /api/rehearsals` - Dodaj próbę
- `PUT /api/rehearsals/:id` - Aktualizuj próbę
- `DELETE /api/rehearsals/:id` - Usuń próbę

### Nagrania (wymagają logowania)
- `GET /api/recordings` - Pobierz nagrania
- `POST /api/recordings` - Dodaj nagranie (z plikiem audio)
- `PUT /api/recordings/:id` - Aktualizuj nagranie
- `DELETE /api/recordings/:id` - Usuń nagranie

### Partytury (wymagają logowania)
- `GET /api/sheet-music` - Pobierz partytury
- `POST /api/sheet-music` - Dodaj partyturę (z plikiem PDF/obrazem)
- `PUT /api/sheet-music/:id` - Aktualizuj partyturę
- `DELETE /api/sheet-music/:id` - Usuń partyturę

### Członkowie (wymagają logowania)
- `GET /api/members` - Pobierz członków
- `GET /api/members/profile` - Pobierz profil użytkownika
- `PUT /api/members/profile` - Aktualizuj profil
- `PUT /api/members/:id/role` - Zmień rolę (admin)
- `DELETE /api/members/:id` - Usuń członka (admin)

## Domyślne dane

Po pierwszym uruchomieniu aplikacja automatycznie utworzy bazę danych SQLite z wymaganymi tabelami. Możesz zarejestrować pierwszego użytkownika, który automatycznie otrzyma rolę członka.

## Wdrożenie

### Backend
- Skonfiguruj zmienne środowiskowe produkcyjne
- Użyj PM2 lub podobnego narzędzia do zarządzania procesami
- Skonfiguruj reverse proxy (nginx) dla produkcji

### Frontend
- Zbuduj aplikację: `npm run build`
- Wdróż pliki z `frontend/build` na serwer WWW
- Skonfiguruj routing po stronie serwera dla SPA

## Licencja

MIT License

## Kontakt

W przypadku pytań lub problemów, skontaktuj się z administratorem projektu.
