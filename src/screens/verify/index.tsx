import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { Local_User_Props, VERIFICATION_TYPE_PROPS, parseQueryParameters } from '../../utils';
import { TOAST_DURATION } from '../../utils/constants';
import { ProgressSpinner } from 'primereact/progressspinner';
import { userAPIHook } from '../../hooks/reactQuery';
import { getAuth } from 'firebase/auth';
import { _getAccessToken } from '../../api';
import { useToast } from '../../providers/toastProvider';
import './index.scss';

const Verify = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState<boolean>(true);
  const [verificationType, setVerificationType] = useState<VERIFICATION_TYPE_PROPS>(null);
  const [verified, setVerified] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  // This isn't needed, but since we're using `React.StrictMode`, `verifyEmailAddress` runs twice, and should only run once
  const [count, setCount] = useState(0);
  const { getUser, setUser } = userAPIHook();

  useEffect(() => {
    setCount(count + 1);
  }, []);

  useEffect(() => {
    if (count === 1) {
      setTimeout(() => {
        parseRoute();
      }, 1000);
    }
  }, [count]);

  useEffect(() => {
    if (!error && token) {
      if (queryParams['mode'] === 'verifyEmail') verifyEmailAddress(token); // Verify Email
      else if (queryParams['mode'] === 'resetPassword') navigate('/reset-password', { state: { token } }); // Password Reset
    }
  }, [token]);

  // Parse the url as we load the page
  const parseRoute = () => {
    // Extract variables
    const tempQueryParams = parseQueryParameters(window.location.href);
    const tempToken = tempQueryParams['oobCode'] || '';

    // Set state variables
    setQueryParams(tempQueryParams);
    setToken(tempToken);
    setVerificationType(tempQueryParams['mode'] as VERIFICATION_TYPE_PROPS);

    // Check for error
    if (!tempToken) {
      setError(true);
      setLoading(false);
    }
  };

  const verifyEmailAddress = (token: string) => {
    applyActionCode(auth, token)
      .then(async () => {
        setVerified(true);
        setLoading(false);

        const tempAuth = getAuth();

        // eslint-disable-next-line
        // @ts-ignore
        await tempAuth.currentUser.reload().then(async () => {
          // This is the only way to get the emailVerified property to update at this point, as 'onAuthStateChanged' doesn't seem to be updating with the 'emailVerified' value change
          if (tempAuth.currentUser?.emailVerified) {
            // If email is verified, update our user object
            const updatedUser = {
              ...getUser(),
              emailVerified: tempAuth.currentUser?.emailVerified,
              email: tempAuth.currentUser.email || '',
              firebaseUid: tempAuth.currentUser.uid || '',
            } as Local_User_Props;
            setUser(updatedUser);
            await _getAccessToken({ forceRefresh: true }); // Force token refresh, otherwise token will show emailVerified as false
          }
        });

        setTimeout(() => {
          if (tempAuth.currentUser) navigate('/chat');
          else navigate('/sign-in', { state: 'verified' });
        }, 1500);
      })
      .catch((err) => {
        console.log('applyActionCode err: ', err);
        setError(true);
        setVerified(false);
        setLoading(false);

        if (toast) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'There was an error when validating your email.', life: TOAST_DURATION });
        }
      });
  };

  return (
    <div className="verify-screen-wrapper">
      <div className="verify-content-wrapper">
        <div className="title xxlargeBold">{loading ? 'Verifying' : error ? 'Error Validating Link' : verified ? 'Verified' : 'Error Verifying!'}</div>

        {error ? (
          <div className="subtitle smallRegular m-b-xxl">There was an error when validating your link. Please request a new link and try again.</div>
        ) : (
          <>
            {verificationType === 'verifyEmail' ? (
              <>
                <div className="subtitle smallRegular m-b-xxl">
                  {loading
                    ? 'Please give us just a moment to verify your email'
                    : verified
                    ? 'Thanks for waiting. Welcome to JakeMotta.com!'
                    : "We're sorry, but there was an error when verifying your email. Please try signing up again."}
                </div>

                {verified && <div className="subtitle smallBold m-b-xl">Logging you in</div>}
              </>
            ) : verificationType === 'resetPassword' ? (
              <>
                <div className="subtitle smallRegular m-b-xxl">
                  {loading
                    ? 'Please give us just a moment to verify your password reset link'
                    : verified
                    ? 'One second. We are redirecting you to reset your password.'
                    : "We're sorry, but there was an error with your reset password link. Please try requesting a new password reset link again."}
                </div>

                {verified && <div className="subtitle smallBold m-b-xl">Rerouting...</div>}
              </>
            ) : null}

            {(loading || verified) && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" fill="transparent" animationDuration="1.5s" />}
          </>
        )}

        {((!loading && !verified) || error) && (
          <Button
            className="smallBold m-b-md"
            onClick={() => {
              navigate('/sign-in');
            }}
          >
            Back to Sign In
          </Button>
        )}
      </div>
    </div>
  );
};

export default Verify;
