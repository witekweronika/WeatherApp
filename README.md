# WeatherAPP 

**WeatherAPP** to aplikacja internetowa do sprawdzania aktualnych warunków pogodowych i prognozy dla wybranych miast. Projekt składa się z interfejsu użytkownika w React oraz serwera API w Node.js i Express.

> **Status projektu:** w trakcie rozwoju. Podstawowe funkcje zostały zaimplementowane, jednak nie wszystkie elementy są ukończone i przetestowane. Aplikacja nie jest przeznaczona do wdrożenia produkcyjnego w obecnym stanie.

## Funkcjonalności

- wyszukiwanie pogody dla wybranego miasta,
- podgląd aktualnej temperatury i warunków atmosferycznych,
- wyświetlanie dodatkowych parametrów pogodowych, m.in. wilgotności, ciśnienia i wiatru,
- prognoza godzinowa oraz wykres temperatury,
- rejestracja i logowanie użytkowników z wykorzystaniem JWT,
- panel użytkownika i podstawowy panel administratora,
- przełączanie motywu jasnego i ciemnego,
- panoramy miast dopasowane do interfejsu aplikacji.

Część funkcji administracyjnych oraz obsługa niektórych danych są jeszcze rozwijane.

## Technologie

| Warstwa | Technologie |
| --- | --- |
| Frontend | React, TypeScript, Vite, Axios, Chart.js, Recharts |
| Backend | Node.js, Express, TypeScript |
| Baza danych | MongoDB, Mongoose |
| Uwierzytelnianie | JSON Web Token (JWT) |
| Dane pogodowe | OpenWeather API |

## Struktura projektu

```text
WeatherAPP/
├── Dashboard/
│   ├── api/                     # Backend (Express + TypeScript)
│   │   ├── lib/
│   │   ├── package.json
│   │   └── .env.example
│   └── front/
│       └── vite-project/        # Frontend (React + Vite)
│           ├── src/
│           ├── public/
│           └── package.json
├── Dokumentacja techniczna projektu WeatherAPP.pdf
└── README.md
```

## Uruchomienie lokalne

### Wymagania

- Node.js i npm,
- dostęp do bazy MongoDB,
- klucz API z serwisu OpenWeather.

### 1. Backend

W terminalu przejdź do katalogu backendu:

```bash
cd Dashboard/api
npm install
```

Utwórz plik `.env` w katalogu `Dashboard/api` na podstawie `.env.example`:

```env
PORT=3100
MONGODB_URI=twoj_adres_polaczenia_z_mongodb
JWT_SECRET=twoj_długi_losowy_sekret
OPENWEATHER_API_KEY=twoj_klucz_openweather
```

Następnie uruchom backend:

```bash
npm run dev
```

Domyślnie API działa pod adresem `http://localhost:3100`.

### 2. Frontend

Otwórz drugi terminal i przejdź do katalogu frontendu:

```bash
cd Dashboard/front/vite-project
npm install
```

W razie potrzeby utwórz plik `.env.local`:

```env
VITE_API_URL=http://localhost:3100/api
```

Uruchom frontend:

```bash
npm run dev
```

Otwórz adres wyświetlony przez Vite w terminalu (zazwyczaj `http://localhost:5173`).

**Uwaga:** polecenia `cd` podano względem głównego katalogu `WeatherAPP`. W przypadku uruchamiania backendu i frontendu korzystaj z dwóch osobnych terminali.

## Aktualny stan i dalszy rozwój

Projekt jest rozwijany. Planowane prace obejmują m.in. dopracowanie panelu administratora, uzupełnienie brakujących funkcji, poprawę obsługi błędów, testy i optymalizację aplikacji.

## Dokumentacja

Szczegółowy opis projektu znajduje się w pliku [`Dokumentacja techniczna projektu WeatherAPP.pdf`](Dokumentacja%20techniczna%20projektu%20WeatherAPP.pdf).

## Bezpieczeństwo

Pliki `.env` i `.env.local` oraz prawdziwe hasła i klucze API **nie powinny trafiać do repozytorium**. Do udostępniania konfiguracji służą pliki `.env.example` bez poufnych wartości.
