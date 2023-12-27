// import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { useQuery } from 'react-query';
import { themeHook, userAPIHook } from '../../hooks/reactQuery';
import { Button } from 'primereact/button';
import Icon from '../../components/icon';
import { theme } from '../../utils/theme';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_TYPES, BeautifyError, isValidEmail } from '../../utils';
import { TOAST_DURATION } from '../../utils/constants';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../providers/toastProvider';
import './index.scss';

const slogan = localStorage.getItem('slogan') || '';

const SignIn = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const location = useLocation();

  // userAPIHook
  const { signInAPIMutation } = userAPIHook();
  const { getTheme } = themeHook();

  const { data: activeTheme = 'light-theme' } = useQuery('theme', getTheme);

  useEffect(() => {
    const userVerified = location?.state === 'verified';
    const passwordReset = location?.state === 'password-reset';

    if (userVerified && toast) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Email verified. Please login to continue.', life: TOAST_DURATION });
    }

    if (passwordReset && toast) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Your password has been reset. Please login to continue.', life: TOAST_DURATION });
    }
  }, []);

  // Listen for changes in sign-in fields
  useEffect(() => {
    setButtonDisabled(!email || !password || !isValidEmail(email));
  }, [email, password]);

  const signIn = (type: AUTH_TYPES) => {
    signInAPIMutation
      .mutateAsync({ type, email, password })
      .then((user) => {
        console.log('signInAPIMutation then: ', user);

        if (user?.emailVerified) successfulSignIn();
        else navigate('/email-verification');
      })
      .catch((e) => {
        console.log('signInAPIMutation catch: ', e);
        if (toast) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: BeautifyError(e as string), life: TOAST_DURATION });
        }
      });
  };

  const successfulSignIn = () => {
    if (toast) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Sign-in successful!', life: TOAST_DURATION });
      navigate('/chat');
    }
  };

  const inputTheme = activeTheme === 'dark-theme' ? 'dark-input' : 'light-input';

  return (
    <div className="sign-in-screen-wrapper">
      <div className="sign-in-content-wrapper">
        <div className="title xxlargeBold">Jake Motta</div>
        <div className="subtitle smallRegular">{slogan}</div>
        <InputText type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={`sign-in-input m-b-md ${inputTheme}`} />
        <InputText type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={`sign-in-input m-b-md ${inputTheme}`} />
        <Button className="smallBold m-b-md" onClick={() => signIn('local')} disabled={buttonDisabled} loading={signInAPIMutation.isLoading}>
          Start Chatting
        </Button>
        <div className="center-text smallRegular clickable m-b-xxl no-select" onClick={() => navigate('/reset-password')}>
          Forgot Password?
        </div>
        <div className="center-text mediumBold m-b-sm">Sign-in with</div>
        <div className="sso-wrapper m-b-xxl">
          <Icon name={'apple'} size={30} classname={'svg-style clickable'} color={theme[activeTheme].color.text} />
          <Icon
            name={'google'}
            size={30}
            classname={'svg-style m-l-md clickable'}
            onClick={() => {
              signIn('google');
            }}
            // style={{ backgroundColor: activeTheme === 'dark-theme' ? theme[activeTheme].color.textLight : theme[activeTheme].color.backgroundDark }}
          />
        </div>
        <div className="sign-in-text-wrapper smallRegular">
          Don't have an account?
          <span className="sign-in-text mediumMedium clickable no-select" onClick={() => navigate('/sign-up')}>
            Sign-Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
