import { StyleSheet } from "react-native-unistyles";
import { Colors } from "../constants/theme";

export const lightTheme = {
  colors: {
    ...Colors.light,
    primary: "#00529B",
    secondary: "#FFD700",
    error: "#F44336",
    success: "#4CAF50",
    warning: "#FF9800",
    card: "#ffffff",
    border: "#EBEBEB",
    background: "#F4F6FA",
    text: "#111111",
    textSecondary: "#888888",
    glass: "rgba(255, 255, 255, 0.18)",
    glassBorder: "rgba(255, 255, 255, 0.35)",
    overlay: "rgba(0, 30, 80, 0.55)",
  },
  margins: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
} as const;

export const darkTheme = {
  colors: {
    ...Colors.dark,
    primary: "#00529B",
    secondary: "#FFD700",
    error: "#F44336",
    success: "#4CAF50",
    warning: "#FF9800",
    card: "#1E1E1E",
    border: "#333333",
    background: "#121212",
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    glass: "rgba(255, 255, 255, 0.1)",
    glassBorder: "rgba(255, 255, 255, 0.2)",
    overlay: "rgba(0, 0, 0, 0.7)",
  },
  margins: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
} as const;

export const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
} as const;

type AppBreakpoints = typeof breakpoints;
type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module "react-native-unistyles" {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  breakpoints,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  settings: {
    initialTheme: "light",
  },
});
