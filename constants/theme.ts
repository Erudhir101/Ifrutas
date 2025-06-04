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
    background: "#FAFAFA",
    border: "#E5E5EA",
    card: "#F2F2F7",
    nav: "#FFFFFF",
    primary: "#007AFF",
    secondary: "#5856D6",
    text: "#000000",
  },
  dark: {
    background: "#101010",
    border: "#38383A",
    card: "#1C1C1E",
    nav: "#000000",
    primary: "#0A84FF",
    secondary: "#5E5CE6",
    text: "#FFFFFF",
  },
};
