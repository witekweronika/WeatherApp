// src/components/HourlyTempChart.tsx
//
// Komponent wykresu temperatury z ostatnich 24 godzin.
// Rysuje prosty wykres liniowy w SVG na podstawie tablicy punktów HourlyPoint.

import React, { useMemo } from "react";               // Import React i hooka useMemo do memoizacji obliczeń.
import { HourlyPoint } from "../api/weatherApi";      // Import typu danych pojedynczego punktu godzinowego.

type Props = {                                        // Typ propsów komponentu.
    data: HourlyPoint[];                              // Tablica punktów godzinowych (czas + temperatura).
    height?: number;                                  // Opcjonalna wysokość SVG (domyślnie 220).
};

const HourlyTempChart: React.FC<Props> = ({           // Definicja komponentu funkcyjnego.
                                              data,                                              // Dane wejściowe do wykresu.
                                              height = 220                                       // Domyślna wysokość wykresu, jeśli nie podano w props.
                                          }) => {
    const width = 520;                                 // Stała szerokość dla viewBox (skalowanie robi SVG przez width="100%").

    const { pathD, labels } = useMemo(() => {          // useMemo liczy ścieżkę wykresu i etykiety tylko gdy zmieni się data/height.
        if (!data || data.length < 2) {                // Jeśli brak danych lub za mało punktów, zwraca puste wartości.
            return { pathD: "", labels: [] as { x: number; text: string }[] };
        }

        const temps = data.map(d => d.temperature);    // Tworzy tablicę temperatur z danych.
        const min = Math.min(...temps);                // Wyznacza minimalną temperaturę (do skali Y).
        const max = Math.max(...temps);                // Wyznacza maksymalną temperaturę (do skali Y).
        const padding = 24;                            // Margines wokół wykresu (na osie i etykiety).

        const plotW = width - padding * 2;             // Efektywna szerokość obszaru rysowania wykresu.
        const plotH = height - padding * 2;            // Efektywna wysokość obszaru rysowania wykresu.

        const xStep = plotW / (data.length - 1);       // Odległość w osi X pomiędzy kolejnymi punktami.
        const yScale = (t: number) => {                // Funkcja mapująca temperaturę na współrzędną Y w SVG.
            if (max === min) return padding + plotH / 2; // Gdy wszystkie temp są równe, rysuje linię pośrodku.
            return padding + (max - t) * (plotH / (max - min)); // Skala odwrócona (większa temp = mniejsze Y).
        };

        const points = data.map((d, i) => {            // Przelicza dane na współrzędne X,Y punktów w SVG.
            const x = padding + i * xStep;             // Wylicza pozycję X dla i-tego punktu.
            const y = yScale(d.temperature);           // Wylicza pozycję Y na podstawie temperatury.
            return { x, y };                           // Zwraca punkt w przestrzeni SVG.
        });

        const d = points                               // Buduje komendę SVG path (M start, L kolejne odcinki).
            .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
            .join(" ");

        const lab = data                               // Generuje etykiety czasu (co 3 godziny) do osi X.
            .map((d, i) => ({ d, i }))                 // Dokleja indeks do każdego punktu.
            .filter(x => x.i % 3 === 0)                // Filtruje punkty co 3.
            .map(x => ({
                x: padding + x.i * xStep,              // Pozycja X etykiety w SVG.
                text: x.d.time,                        // Tekst etykiety (np. "13:00").
            }));

        return { pathD: d, labels: lab };              // Zwraca ścieżkę linii i etykiety do renderowania.
    }, [data, height]);                                // Memoizacja zależy od data i height.

    if (!data || data.length === 0) return <p>Brak danych do wykresu.</p>; // Prosta obsługa przypadku braku danych.

    return (
        <div style={{ width: "100%" }}>                {/* Wrapper wymuszający responsywność SVG (width: 100%). */}
            <svg
                viewBox={`0 0 ${width} ${height}`}     // Ustawia układ współrzędnych SVG.
                width="100%"                           // SVG dopasowuje się do szerokości kontenera.
                height={height}                        // Ustawia wysokość SVG na wartość z props.
                role="img"                             // Semantyka dla dostępności (to jest grafika).
                aria-label="Wykres temperatury 24h"    // Opis dla czytników ekranu.
            >
                <line                                  // Rysuje oś X.
                    x1="24"
                    y1={height - 24}
                    x2={width - 24}
                    y2={height - 24}
                    stroke="currentColor"
                    opacity="0.25"
                />
                <line                                  // Rysuje oś Y.
                    x1="24"
                    y1="24"
                    x2="24"
                    y2={height - 24}
                    stroke="currentColor"
                    opacity="0.25"
                />

                {pathD && (                             // Renderuje linię wykresu tylko jeśli pathD nie jest pusty.
                    <path
                        d={pathD}                       // Zapis ścieżki SVG.
                        fill="none"                     // Bez wypełnienia.
                        stroke="currentColor"           // Kolor linii dziedziczony z CSS (currentColor).
                        strokeWidth="2.5"               // Grubość linii.
                    />
                )}

                {data.map((d, i) => {                   // Renderuje punkty (kółka) oraz tooltipy dla każdego punktu.
                    const x = 24 + i * ((width - 48) / (data.length - 1)); // Wylicza X punktu na osi.
                    const temps = data.map(x => x.temperature);            // Wyciąga temperatury (do wyliczenia min/max).
                    const min = Math.min(...temps);                        // Liczy minimalną temperaturę.
                    const max = Math.max(...temps);                        // Liczy maksymalną temperaturę.
                    const plotH = height - 48;                             // Wysokość obszaru rysowania bez paddingu.

                    const y =                                               // Wylicza Y punktu analogicznie do skali.
                        max === min
                            ? 24 + plotH / 2
                            : 24 + (max - d.temperature) * (plotH / (max - min));

                    return (
                        <g key={d.dt}>                    {/* Grupuje elementy SVG dla pojedynczego punktu. */}
                            <circle
                                cx={x}                    // Pozycja X kółka.
                                cy={y}                    // Pozycja Y kółka.
                                r="3"                     // Promień kółka.
                                fill="currentColor"       // Kolor kółka dziedziczony z CSS.
                            />
                            <title>{`${d.time}: ${d.temperature.toFixed(1)}°`}</title> {/* Tooltip po najechaniu myszą. */}
                        </g>
                    );
                })}

                {labels.map((l, idx) => (                // Renderuje etykiety czasu na osi X (co 3 godziny).
                    <text
                        key={idx}                         // Klucz elementu listy etykiet.
                        x={l.x}                           // Pozycja X etykiety.
                        y={height - 8}                    // Pozycja Y etykiety (blisko dołu).
                        textAnchor="middle"               // Wyśrodkowuje tekst względem x.
                        fontSize="12"                     // Rozmiar czcionki etykiet.
                        fill="currentColor"               // Kolor tekstu dziedziczony z CSS.
                        opacity="0.8"                     // Przezroczystość tekstu.
                    >
                        {l.text}                          // Tekst etykiety (np. "06:00").
                    </text>
                ))}
            </svg>
        </div>
    );
};

export default HourlyTempChart;                            // Eksport komponentu do użycia w widokach.
