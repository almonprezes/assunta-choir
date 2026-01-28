# Chór Assunta - Strona internetowa

Kompletna strona internetowa dla Parafialnego Chóru "Assunta" z backendem i frontendem.

## 🎵 Funkcjonalności v1.0.0

### Frontend (dla publiczności)
- **Strona główna** - informacje o chórze, najnowsze wydarzenia
- **Koncerty** - kalendarz nadchodzących koncertów z relacjami
- **O chórze** - historia, misja i informacje o zespole
- **Rejestracja** - formularz dla nowych członków z zatwierdzaniem

### Backend (strefa członkowska)
- **Panel użytkownika** - personalizowany dashboard
- **Profil użytkownika** - edycja danych osobowych i głosu
- **Próby** - terminarz prób z informacjami o lokalizacji i czasie trwania
- **Nagrania** - biblioteka nagrań audio z prób i koncertów
- **Partytury** - udostępnianie nut i materiałów muzycznych (PDF)
- **Członkowie** - zarządzanie członkami z systemem zatwierdzania
- **System uwierzytelniania** - bezpieczne logowanie i rejestracja

## 🛠️ Technologia

### Backend
- **Node.js** z **Express.js**
- **SQLite** jako baza danych
- **JWT** do autentykacji
- **Multer** do uploadu plików
- **bcryptjs** do hashowania haseł
- **Rate limiting** i **CORS**

### Frontend
- **React 18** z **React Router**
- **Tailwind CSS** do stylizacji
- **React Query** do zarządzania stanem
- **Lucide React** do ikon
- **Axios** do komunikacji z API

## 🚀 Instalacja

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

## 📁 Struktura projektu

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

## 🔄 Przepływ pracy Git

### Branches
- **master** - stabilna wersja produkcyjna
- **develop** - development branch
- **production** - branch dla wdrożeń produkcyjnych

### Tagi
- **v1.0.0** - pierwsza wersja produkcyjna

### Conventional Commits
- `feat:` - nowe funkcjonalności
- `fix:` - poprawki błędów
- `docs:` - dokumentacja
- `style:` - formatowanie kodu
- `refactor:` - refaktoryzacja
- `test:` - testy

## 📡 API Endpoints

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
- `GET /api/members/pending` - Pobierz oczekujących członków (admin)
- `PUT /api/members/:id/approve` - Zatwierdź członka (admin)
- `DELETE /api/members/:id/reject` - Odrzuć członka (admin)
- `GET /api/members/profile` - Pobierz profil użytkownika
- `PUT /api/members/profile` - Aktualizuj profil
- `PUT /api/members/:id/role` - Zmień rolę (admin)
- `DELETE /api/members/:id` - Usuń członka (admin)

## 👤 Domyślne dane

### Administrator
- **Login:** `norbert`
- **Hasło:** `assunta2024`
- **Rola:** Administrator
- **Dane:** Norbert Bryłka, Bas

Po pierwszym uruchomieniu aplikacja automatycznie utworzy bazę danych SQLite z wymaganymi tabelami i domyślnym administratorem.

## 🚀 Wdrożenie

### Backend
- Skonfiguruj zmienne środowiskowe produkcyjne
- Użyj PM2 lub podobnego narzędzia do zarządzania procesami
- Skonfiguruj reverse proxy (nginx) dla produkcji

### Frontend
- Zbuduj aplikację: `npm run build`
- Wdróż pliki z `frontend/build` na serwer WWW
- Skonfiguruj routing po stronie serwera dla SPA

## 🎯 Funkcjonalności v1.0.0

### ✅ Zaimplementowane
- System autentykacji i autoryzacji
- Zarządzanie członkami z zatwierdzaniem
- Edycja profilu użytkownika
- Zarządzanie koncertami z relacjami
- Biblioteka partytur (PDF) z pobieraniem
- Biblioteka nagrań audio
- System prób
- Wsparcie dla polskich znaków
- Profesjonalny UI z Tailwind CSS
- Dashboard admina
- Upload plików z bezpieczeństwem
- Baza danych SQLite
- API z Express.js i Node.js

### 🔧 Poprawki
- Poprawiono kodowanie polskich znaków (Bryłka)
- Naprawiono pobieranie partytur
- Naprawiono API routes dla członków
- Poprawiono serwowanie plików statycznych
- Naprawiono kodowanie w bazie danych

## 📄 Licencja

MIT License

## 📞 Kontakt

W przypadku pytań lub problemów, skontaktuj się z administratorem projektu.

---

**Chór Assunta Lwówek** - Parafialny chór z Lwówka Wielkopolskiego 🎶
