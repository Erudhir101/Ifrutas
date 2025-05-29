export type ColorPalette = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  border: string;
  card: string;
  nav: string;
};

export type Theme = "light" | "dark"; // Or whatever theme names you have

export type Themes = {
  [key in Theme]: ColorPalette;
};

export const themes: Themes = {
  light: {
    background: "#FFFFFF",
    text: "#000000",
    primary: "#007AFF",
    secondary: "#5856D6",
    border: "#E5E5EA",
    card: "#F2F2F7",
    nav: "#FAFAFA",
  },
  dark: {
    background: "#000000",
    text: "#FFFFFF",
    primary: "#0A84FF",
    secondary: "#5E5CE6",
    border: "#38383A",
    card: "#1C1C1E",
    nav: "#101010",
  },
};
