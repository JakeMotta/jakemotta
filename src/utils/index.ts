import { API_ERRORS } from './constants';
export * from './types';
export * from './graphColors';
export * from './initialData';

// Random number generator
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random string generator
export function getRandomString(size: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }

  return randomString;
}

// Hex to RGBA converter
export function hexToRgba(hex: string, alpha: number = 1): string {
  // Remove the "#" symbol if present
  hex = hex.replace(/^#/, '');

  // Check if the input is a valid hex color code
  if (!/^[0-9A-Fa-f]{6}$/i.test(hex) && !/^[0-9A-Fa-f]{8}$/i.test(hex)) {
    return '#FFF'; // Return null for invalid input
  }

  // Parse the hex values for red, green, and blue
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Ensure the alpha value is between 0 and 1
  alpha = Math.max(0, Math.min(1, alpha));

  // Format the RGBA color string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function rgbaToHex(rgba: string): string {
  // Parse the RGBA values
  const match = rgba.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
  if (!match) {
    throw new Error('Invalid RGBA color format');
  }

  // Extract the color components
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = parseFloat(match[4]);

  // Ensure the components are in the valid range (0-255 for RGB, 0-1 for alpha)
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 || a < 0 || a > 1) {
    throw new Error('RGBA color components out of range');
  }

  // Convert the RGB values to hexadecimal
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');

  // Convert the alpha value to hexadecimal (rounded to two decimal places)
  const hexA = Math.round(a * 255)
    .toString(16)
    .padStart(2, '0');

  // Combine the components into a hexadecimal color string
  return `#${hexR}${hexG}${hexB}${hexA}`;
}

export function darkenHexColor(hex: string, factor: number): string {
  // Remove the '#' if it's included in the hex value
  hex = hex.replace('#', '');

  // Parse the hex value into RGB components
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  // Apply the darkness factor (a value between 0 and 1)
  r = Math.max(0, Math.floor(r * (1 - factor)));
  g = Math.max(0, Math.floor(g * (1 - factor)));
  b = Math.max(0, Math.floor(b * (1 - factor)));

  // Convert the RGB values back to a hex string
  const darkenedHex = `#${(r * 0x10000 + g * 0x100 + b).toString(16).padStart(6, '0')}`;

  return darkenedHex;
}

export function shortenCurrency(value: string | number | null): string {
  if (!value) return '0';

  if (typeof value === 'string') value = parseFloat(value);

  if (value >= 1e12) {
    return (value / 1e12).toFixed(1) + 'T'; // Trillion
  } else if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + 'B'; // Billion
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + 'M'; // Million
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + 'K'; // Thousand
  } else {
    return value.toString(); // Less than 1000, no change
  }
}

// Check if a string is a valid email address
export function isValidEmail(email: string): boolean {
  // Regular expression pattern for validating email addresses
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Use the test method to check if the email matches the pattern
  return emailPattern.test(email);
}

// Return a beutified error message
export function BeautifyError(err: string) {
  if (!err) return '';
  return API_ERRORS[err] ? API_ERRORS[err] : 'There was an error. Please try again.';
}

// Parses a string and returns a query parameters as an object
export function parseQueryParameters(url: string): Record<string, string> {
  const queryString = url.split('?')[1];
  if (!queryString) {
    return {};
  }

  const params = new URLSearchParams(queryString);
  const queryParams: Record<string, string> = {};

  // @ts-ignore
  for (const [key, value] of params.entries()) {
    // eslint-disable-next-line
    queryParams[key] = value;
  }

  return queryParams;
}

export function formatNumberShorthand(num: number): string {
  if (num >= 1_000_000_000_000 || num <= -1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(0) + 'T';
  if (num >= 1_000_000_000 || num <= -1_000_000_000) return (num / 1_000_000_000).toFixed(0) + 'B';
  if (num >= 1_000_000 || num <= -1_000_000) return (num / 1_000_000).toFixed(0) + 'M';
  if (num >= 1_000 || num <= -1_000) return (num / 1_000).toFixed(0) + 'K';
  return num.toString();
}
