// src/utils/normalizeCity.ts
//
// Funkcja pomocnicza do normalizacji nazwy miasta do postaci “klucza” (np. pod panoramy).
// Usuwa białe znaki, zmienia na małe litery, usuwa znaki diakrytyczne i spacje.

export const normalizeCity = (s: string) =>       // Eksportuje funkcję przyjmującą nazwę miasta jako string.
    s
        .trim()                                       // Usuwa białe znaki z początku i końca.
        .toLowerCase()                                // Konwertuje cały tekst na małe litery.
        .normalize("NFD")                             // Rozdziela litery i znaki diakrytyczne (np. "ą" -> "a" + znak diakrytyczny).
        .replace(/[\u0300-\u036f]/g, "")         // Usuwa znaki diakrytyczne z zakresu Unicode (akcenty, ogonki itd.).
        .replace(/[łŁ]/g, "l")                   // Zamienia "ł"/"Ł" na "l" (na wypadek, gdy normalize nie zdejmie tego znaku).
        .replace(/\s+/g, "");                    // Usuwa wszystkie spacje i ciągi spacji (np. "New York" -> "newyork").
