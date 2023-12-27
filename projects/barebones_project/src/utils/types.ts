import { User as FirebaseUserProps } from 'firebase/auth';

/** TYPES **/
export type VERIFICATION_TYPE_PROPS = 'verifyEmail' | 'resetPassword' | null;
export type API_REQUEST_TYPES = 'post' | 'get' | 'put' | 'delete' | 'patch';
export type AUTH_TYPES = 'local' | 'google' | 'apple'; // Available auth types
export interface SSO_SIGNIN_PROPS {
  type: 'google' | 'apple';
}
export type ApiBody_SignIn_Props = Local_SignIn_Props | SSO_SIGNIN_PROPS; // Sign In Props
export type ApiBody_SignUp_Props = Local_SignUp_Props | SSO_SIGNIN_PROPS; // Sign Up Props

// Theme types
export type AppThemes = 'dark-theme' | 'light-theme';

/** API Responses **/
export type ApiResponse_Followup_Props = string[];

export interface ApiResponse_Get_Users_Me_Props {
  email: string;
  firebaseUid: string;
  firstName: string;
  lastName: string;
  _id: string;
}

/** API Body **/
export interface ApiBody_Post_Auth_Signup_Props {
  firstName: string;
  lastName: string;
}

export interface ApiBody_Request_Props {
  method: API_REQUEST_TYPES;
  uri: string;
  // eslint-disable-next-line
  data?: any;
  // eslint-disable-next-line
  headers?: any;
  // eslint-disable-next-line
  params?: any;
}

export interface Local_SignUp_Props {
  type: 'local';
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Local_SignIn_Props {
  type: 'local';
  email: string;
  password: string;
}

/** Utils **/
export type Util_StringDictionary_Props = {
  [key: string]: string;
};

/** Firebase **/
export interface Firebase_Extended_User_Props extends FirebaseUserProps {
  accessToken?: string;
}

/** To Do **/
export interface Local_User_Props extends ApiResponse_Get_Users_Me_Props {
  accessToken?: string;
  emailVerified?: boolean;
  image?: string;
}

export interface ApiBody_GetAccessToken_Props {
  forceRefresh?: boolean;
} // Automatically generated IconType
export type IconType = 'apple' | 'cisco' | 'fila' | 'google' | 'kfc' | 'lego' | 'mastercard' | 'mcdonalds' | 'microsoft' | 'shell' | 'slack' | 'snapchat' | 'ups' | 'visa';
