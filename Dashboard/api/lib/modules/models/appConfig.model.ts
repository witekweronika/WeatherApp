export type ThemeName = 'light' | 'dark';

export interface IAppConfig {
    _id?: string;
    name: string;          // np. "default"
    theme: ThemeName;      // 'light' | 'dark'
    primaryColor?: string; // np. "#ff6600"
    secondaryColor?: string;
    defaultCity?: string;  // np. "Krakow"
}
