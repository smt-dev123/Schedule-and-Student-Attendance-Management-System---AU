import { StyleSheet } from 'react-native-unistyles';
import { breakpoints } from './breakpoints';
import { darkTheme, lightTheme } from './themes';

const appThemes = {
  light: lightTheme,
  dark: darkTheme
};

type AppBreakpoints = typeof breakpoints
type AppThemes = typeof appThemes

declare module 'react-native-unistyles' {
    export interface UnistylesThemes extends AppThemes {}
    export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes: appThemes,
  breakpoints,
  settings: {
    initialTheme: 'light',
  }
});
