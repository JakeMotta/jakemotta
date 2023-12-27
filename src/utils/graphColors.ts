import { hexToRgba } from '.';
import { AppThemes } from './types';

// Returns a color from the graphColors array based on the current app theme
export const getGraphColors = (index: number, opacity: number, theme: AppThemes | null) => {
  if (!theme) theme = 'light-theme';
  const useTheme = theme === 'light-theme' ? lightGraphColors : darkGraphColors;
  return hexToRgba(useTheme[index], opacity);
};

export const darkGraphColors = ['#FCFEDE', '#D9F5D0', '#9BDCBB', '#1BBCB1', '#0295AE', '#005D9C', '#27195E'];
export const lightGraphColors = ['#27195E', '#005D9C', '#0295AE', '#1BBCB1', '#9BDCBB', '#D9F5D0', '#FCFEDE'];
