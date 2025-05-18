import { useContext } from "react";
import { ThemeContext } from "../components/ThemeContext";
import { themes, ColorPalette, Theme } from "../constants/theme";

export function useTheme() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const colors: ColorPalette = themes[theme as Theme];

  return {
    theme,
    toggleTheme,
    colors,
  };
}
