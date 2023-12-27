import { Util_StringDictionary_Props } from './types';

export const MINIMUM_PASSWORD_LENGTH = 6;
export const TOAST_DURATION = 3000;
export const PAYMENT_REDIRECT_TIMEOUT = -5; // seconds before timeout failure
export const NUMBER_OF_MESSAGES_TO_FETCH = 5; // number of messages to fetch per page
export const CHAT_SEARCH_RESULT_LIMIT = 100; // number of chats to fetch per page
export const LAZY_SCROLL_FETCH_THRESHHOLD = 0.9; // number of messages to fetch per page
export const CHAT_SEARCH_DEBOUNCE_TIME = 300; // Time to wait before searching chats
export const TABLE_DATA_DEFAULT_ROW_COUNT = 2; // Number of rows in table data by default

export const API_ERRORS: Util_StringDictionary_Props = {
  'auth/too-many-requests': 'Too many requests. Please try again later.',
  'auth/email-already-in-use': 'Email already in use',
  'auth/invalid-email': 'Invalid email',
  'auth/weak-password': `Weak password. Please use at least ${MINIMUM_PASSWORD_LENGTH} characters.`,
  'auth/invalid-login-credentials': 'Incorrect username or password',
};
