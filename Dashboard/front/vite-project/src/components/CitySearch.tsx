// src/components/CitySearch.tsx

// Komponent formularza wyszukiwania miasta.
// Umożliwia wpisanie nazwy miasta i wywołanie callbacka onSearch po zatwierdzeniu formularza.

import React, { FormEvent, useState } from 'react';   // Import React + typ zdarzenia formularza + hook do stanu.

interface CitySearchProps {                           // Interfejs opisujący propsy komponentu.
    onSearch: (city: string) => void;                   // Funkcja wywoływana po wyszukaniu (przekazuje nazwę miasta).
    defaultCity?: string;                               // Opcjonalna domyślna wartość inputa.
}

const CitySearch: React.FC<CitySearchProps> = ({      // Definicja komponentu funkcyjnego z typowaniem propsów.
                                                   onSearch,                                           // Destrukturyzacja props: callback wyszukiwania.
                                                   defaultCity = 'Warszawa',                            // Ustawia domyślne miasto, jeśli defaultCity nie zostało podane.
                                               }) => {
    const [city, setCity] = useState(defaultCity);       // Stan lokalny przechowujący aktualną wartość inputa.

    const handleSubmit = (e: FormEvent) => {             // Handler uruchamiany przy wysłaniu formularza.
        e.preventDefault();                                // Blokuje domyślne przeładowanie strony po submit.
        const trimmed = city.trim();                       // Usuwa białe znaki z początku i końca wpisu.
        if (!trimmed) return;                              // Jeśli po trimowaniu jest pusty string, kończy bez wyszukiwania.
        onSearch(trimmed);                                 // Wywołuje callback z “oczyszczoną” nazwą miasta.
    };

    return (
        <form className="city-search" onSubmit={handleSubmit}> {/* Formularz; submit uruchamia handleSubmit. */}
            <input
                type="text"                                    // Pole tekstowe do wpisania miasta.
                value={city}                                   // Kontrolowany input: wartość pochodzi ze stanu city.
                onChange={e => setCity(e.target.value)}         // Aktualizuje stan city przy każdej zmianie inputa.
                placeholder="Wpisz miasto..."                   // Tekst pomocniczy w polu, gdy jest puste.
            />
            <button type="submit" className="btn btn--primary"> {/* Przycisk submit wysyłający formularz. */}
                Szukaj
            </button>
        </form>
    );
};

export default CitySearch;                              // Eksport komponentu do użycia w innych widokach (np. DashboardUser).
