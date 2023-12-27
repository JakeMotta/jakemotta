import { InputText } from 'primereact/inputtext';
import { useQuery } from 'react-query';
import { themeHook, userAPIHook } from '../../hooks/reactQuery';
import { Button } from 'primereact/button';
import Icon from '../../components/icon';
import { theme } from '../../utils/theme';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_TYPES, BeautifyError, isValidEmail } from '../../utils';
import { MINIMUM_PASSWORD_LENGTH, TOAST_DURATION } from '../../utils/constants';
import { useToast } from '../../providers/toastProvider';
import './index.scss';

const slogan = localStorage.getItem('slogan') || '';

const SignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // userAPIHook
  const { signUpAPIMutation } = userAPIHook();
  const { getTheme } = themeHook();

  const { data: activeTheme = 'light-theme' } = useQuery('theme', getTheme);

  // Listen for changes in sign-sup fields
  useEffect(() => {
    setButtonDisabled(!firstName || !lastName || !email || !password || password.length < MINIMUM_PASSWORD_LENGTH || !isValidEmail(email));
  }, [firstName, lastName, email, password]);

  const signUp = (type: AUTH_TYPES) => {
    signUpAPIMutation
      .mutateAsync({ type, firstName, lastName, email, password })
      .then((user) => {
        console.log('signUpAPIMutation then: ', user);

        if (user?.emailVerified) successfulSignIn();
        else navigate('/email-verification');
      })
      .catch((e) => {
        console.log('signUpAPIMutation catch: ', e);
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
    <div className="sign-up-screen-wrapper">
      <div className="sign-up-content-wrapper">
        <div className="title xxlargeBold">Jake Motta</div>
        <div className="subtitle smallRegular">{slogan}</div>
        <InputText type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`sign-up-input m-b-md ${inputTheme}`} />
        <InputText type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={`sign-up-input m-b-md ${inputTheme}`} />
        <InputText type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={`sign-up-input m-b-md ${inputTheme}`} />
        <InputText type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={`sign-up-input m-b-md ${inputTheme}`} />
        <Button className="smallBold m-b-md" onClick={() => signUp('local')} loading={signUpAPIMutation.isLoading} disabled={buttonDisabled}>
          Start Chatting
        </Button>
        <div className="center-text mediumBold m-b-sm">Sign-up with</div>
        <div className="sso-wrapper m-b-xxl">
          <Icon name={'apple'} size={30} classname={'svg-style clickable'} color={theme[activeTheme].color.text} />
          <Icon
            name={'google'}
            size={30}
            classname={'svg-style m-l-md clickable'}
            onClick={() => {
              signUp('google');
            }}
          />
        </div>
        <div className="sign-up-text-wrapper smallRegular">
          Already have an account?
          <span className="sign-up-text mediumMedium clickable no-select" onClick={() => navigate('/sign-in')}>
            Sign-In
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
