// src/config/panoramas.ts
//
// Konfiguracja mapowania miasto -> ścieżka do panoramy tła.
// Zawiera osobne mapy dla trybu jasnego i ciemnego oraz funkcję pomocniczą do wyboru odpowiedniego obrazka.

export type BgMode = "light" | "dark";

export const DEFAULT_PANORAMA = "/panoramas/chmury.png";
export const DEFAULT_PANORAMA_DARK = "/panoramas/chmury_dark.png";

export const PANORAMAS: Record<string, string> = {
    warszawa: "/panoramas/warszawa.png",
    krakow: "/panoramas/krakow.png",
    berlin: "/panoramas/berlin.png",
    barcelona: "/panoramas/barcelona.png",
    bruksela: "/panoramas/bruksela.png",
    budapeszt: "/panoramas/budapeszt_1.png",
    buenos: "/panoramas/buenosaires.png",
    chicago: "/panoramas/chicago.png",
    delhi: "/panoramas/delhi.png",
    dubaj: "/panoramas/dubaj.png",
    kair: "/panoramas/kair.png",
    losangeles: "/panoramas/los_angeles.png",
    lasvegas: "/panoramas/las_vegas.png",
    londyn: "/panoramas/londyn_2.png",
    madryt: "/panoramas/madryt_1.png",
    melbourne: "/panoramas/melbourne.png",
    nowyjork: "/panoramas/nowy_jork.png",
    pekin: "/panoramas/pekin.png",
    riodejaneiro: "/panoramas/rio.png",
    paryz: "/panoramas/paryz_2.png",
    praga: "/panoramas/praga.png",
    rzym: "/panoramas/rzym.png",
    saopaulo: "/panoramas/sao_paulo.png",
    seul: "/panoramas/seul.png",
    singapur: "/panoramas/singapur.png",
    stambul: "/panoramas/stambul.png",
    sydney: "/panoramas/sydney.png",
    tokio: "/panoramas/tokio.png",
    toronto: "/panoramas/toronto.png",
    waszyngton: "/panoramas/waszyngton.png",
};

export const PANORAMAS_DARK: Record<string, string> = {
    warszawa: "/panoramas/warszawa_dark.png",
    krakow: "/panoramas/krakow_dark.png",
    berlin: "/panoramas/berlin_dark.png",
    barcelona: "/panoramas/barcelona_dark.png",
    bruksela: "/panoramas/bruksela_dark.png",
    budapeszt: "/panoramas/budapeszt_1_dark.png",
    buenosaires: "/panoramas/buenos_aires_dark.png",
    chicago: "/panoramas/chicago_dark.png",
    delhi: "/panoramas/delhi_dark.png",
    dubaj: "/panoramas/dubaj_dark.png",
    kair: "/panoramas/kair_dark.png",
    losangeles: "/panoramas/los_angeles_dark.png",
    lasvegas: "/panoramas/las_vegas_dark.png",
    londyn: "/panoramas/londyn_2_dark.png",
    madryt: "/panoramas/madryt_1_dark.png",
    melbourne: "/panoramas/melbourne_dark.png",
    nowyjork: "/panoramas/nowy_jork_dark.png",
    pekin: "/panoramas/pekin_dark.png",
    riodejaneiro: "/panoramas/rio_dark.png",
    paryz: "/panoramas/paryz_2_dark.png",
    praga: "/panoramas/praga_dark.png",
    rzym: "/panoramas/rzym_dark.png",
    sao: "/panoramas/sao_paulo_dark.png",
    seul: "/panoramas/seul_dark.png",
    singapur: "/panoramas/singapur_dark.png",
    stambul: "/panoramas/stambul_dark.png",
    sydney: "/panoramas/sydney_dark.png",
    tokio: "/panoramas/tokio_dark.png",
    toronto: "/panoramas/toronto_dark.png",
    waszyngton: "/panoramas/waszyngton_dark.png",
};

export const getPanorama = (cityKey: string, mode: BgMode): string => {
    if (mode === "dark") {
        return PANORAMAS_DARK[cityKey] ?? DEFAULT_PANORAMA_DARK;
    }
    return PANORAMAS[cityKey] ?? DEFAULT_PANORAMA;
};
