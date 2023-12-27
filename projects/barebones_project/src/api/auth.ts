import {
  ApiBody_Post_Auth_Signup_Props,
  ApiBody_SignIn_Props,
  ApiBody_SignUp_Props,
  ApiResponse_Get_Users_Me_Props,
  Local_SignIn_Props,
  Local_SignUp_Props,
  Firebase_Extended_User_Props,
  ApiBody_GetAccessToken_Props,
} from '../utils';
import { UserCredential, createUserWithEmailAndPassword, getIdToken, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../services/firebase';
import { signInWithPopup, getAdditionalUserInfo, sendEmailVerification } from 'firebase/auth';
import { http } from '.';

// Returns the access token for the currently logged in user
export const _getAccessToken = async ({ forceRefresh }: ApiBody_GetAccessToken_Props) => {
  try {
    const user = auth?.currentUser;
    let accessToken = '';

    if (user) {
      accessToken = await getIdToken(user, forceRefresh)
        .then((token) => {
          localStorage.setItem('accessToken', token || '');
          return token;
        })
        .catch((error) => {
          console.error('Error getting ID token:', error);
          return '';
        });
    }
    return accessToken; // Return the response data directly
  } catch (e) {
    throw e; // Re-throw the error to be caught by the caller
  }
};

// Create a new user in our backend
const _createUser = async ({ firstName, lastName }: ApiBody_Post_Auth_Signup_Props) => {
  const uri = `auth/signup`;

  try {
    const response = await http({ method: 'post', uri, data: { firstName, lastName } });

    // eslint-disable-next-line
    const data: ApiResponse_Get_Users_Me_Props = response.data;

    console.log(`${uri} res: `, data);
    // eslint-disable-next-line
    return data; // Return the response data directly
  } catch (e) {
    console.log(`${uri} error: `, e);
    throw e; // Re-throw the error to be caught by the caller
  }
};

export const _sendVerificationEmail = async () => {
  try {
    const user = auth?.currentUser;

    if (user) {
      await sendEmailVerification(user).catch((e) => console.log(e));
      return true;
    }

    return false; // Return the response data directly
  } catch (e) {
    throw e; // Re-throw the error to be caught by the caller
  }
};

// Get the user's ID from our backend
export const _getUserIDFromDatabase = async (): Promise<ApiResponse_Get_Users_Me_Props> => {
  try {
    const response = await http({ method: 'get', uri: 'users/me' });

    // eslint-disable-next-line
    const data: ApiResponse_Get_Users_Me_Props = response.data;

    // eslint-disable-next-line
    const uid: string = response.data?._id || '';
    localStorage.setItem('userId', uid);
    return data;
  } catch (e) {
    console.log('_getUserIDFromDatabase catch: ', e);
    throw e;
  }
};

export const _signup = async (props: ApiBody_SignUp_Props): Promise<Firebase_Extended_User_Props | null> => {
  try {
    const { type } = props;
    let user = null;
    if (type === 'local') user = await _localSignUp(props);
    else if (type === 'google') user = await _googleSignIn();

    return user;
  } catch (e) {
    console.log('_signup catch: ', e);
    throw e;
  }
};

export const _localSignUp = async ({ firstName, lastName, email, password }: Local_SignUp_Props): Promise<Firebase_Extended_User_Props> => {
  try {
    // Call Firebase endpoint
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await _createUser({ firstName, lastName });
    await _localSignIn({ type: 'local', email, password });
    return user;
  } catch (e) {
    console.log('_localSignUp catch: ', e);
    // eslint-disable-next-line
    // @ts-ignore
    throw e?.code;
  }
};

export const _signin = async (props: ApiBody_SignIn_Props): Promise<Firebase_Extended_User_Props | null> => {
  try {
    const { type } = props;
    let user = null;
    if (type === 'local') user = await _localSignIn(props);
    else if (type === 'google') user = await _googleSignIn();

    return user;
  } catch (e) {
    console.log('_signin catch: ', e);
    throw e;
  }
};

export const _localSignIn = async ({ email, password }: Local_SignIn_Props): Promise<Firebase_Extended_User_Props> => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (e) {
    console.log('_localSignIn catch: ', e);
    // eslint-disable-next-line
    // @ts-ignore
    throw e?.code;
  }
};

export const _googleSignIn = async () => {
  try {
    return signInWithPopup(auth, provider)
      .then(async (result: UserCredential) => {
        const user: Firebase_Extended_User_Props = result.user;

        let firstName = '';
        let lastName = '';
        let newUser = true;

        const additionalUserInfo = getAdditionalUserInfo(result);

        if (additionalUserInfo) {
          firstName = (additionalUserInfo.profile?.given_name as string) || '';
          lastName = (additionalUserInfo.profile?.family_name as string) || '';
          newUser = additionalUserInfo.isNewUser;
        } else {
          const nameSplit = user?.displayName?.split(' ');

          if (nameSplit && nameSplit.length > 0) {
            firstName = nameSplit[0];
            lastName = nameSplit[nameSplit.length - 1];
          }
        }

        if (newUser) await _createUser({ firstName, lastName });
        return user;
      })
      .catch((e) => {
        console.log('signInWithPopup catch: ', e);
        throw e;
      });
  } catch (e) {
    console.log('_googleSignIn catch: ', e);
    throw e;
  }
};
