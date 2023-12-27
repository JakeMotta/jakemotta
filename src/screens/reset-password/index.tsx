import { InputText } from 'primereact/inputtext';
import { useQuery } from 'react-query';
import { themeHook } from '../../hooks/reactQuery';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BeautifyError, isValidEmail } from '../../utils';
import { MINIMUM_PASSWORD_LENGTH, TOAST_DURATION } from '../../utils/constants';
import { useLocation } from 'react-router-dom';
import { confirmPasswordReset, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useToast } from '../../providers/toastProvider';
import './index.scss';

const slogan = localStorage.getItem('slogan') || '';

const ResetPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [settingNewPassword, setSettingNewPassword] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [error, setError] = useState<string | boolean>(false);

  const location = useLocation();

  const [allowResend, setAllowResend] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  // userAPIHook
  const { getTheme } = themeHook();

  const { data: activeTheme = 'light-theme' } = useQuery('theme', getTheme);

  useEffect(() => {
    // eslint-disable-next-line
    let token = (location?.state?.token as string) || '';
    if (token) {
      setSettingNewPassword(true);
      setToken(token);
    }
  }, []);

  useEffect(() => {
    const userVerified = location?.state === 'verified';

    if (userVerified && toast) {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Email verified. Please login to continue.', life: TOAST_DURATION });
    }
  }, []);

  // Listen for changes in sign-in fields
  useEffect(() => {
    if (settingNewPassword) {
      setError(false);
      setButtonDisabled(!password || !confirmPassword || password.length < MINIMUM_PASSWORD_LENGTH || confirmPassword.length < MINIMUM_PASSWORD_LENGTH);
    } else {
      setButtonDisabled(!email || !isValidEmail(email));
    }
  }, [email, password, confirmPassword]);

  const requestNewPassword = () => {
    setLoading(true);
    setAllowResend(false);

    setTimeout(() => {
      setLoading(false);
      setAllowResend(true);

      if (toast) {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: "We've sent an password reset link to your email.", life: TOAST_DURATION });
      }

      sendPasswordResetEmail(auth, email).catch((e) => {
        if (toast) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: BeautifyError(e as string), life: TOAST_DURATION });
        }
      });
    }, 500);
  };

  const resetPassword = () => {
    setLoading(true);

    if (password !== confirmPassword) {
      setError(true);
      setLoading(false);

      if (toast) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: "Passwords don't match", life: TOAST_DURATION });
      }
      return;
    }

    setTimeout(() => {
      confirmPasswordReset(auth, token, password)
        .then(() => {
          setLoading(false);
          navigate('/sign-in', { state: 'password-reset' });
        })
        .catch((e) => {
          setLoading(false);
          if (toast) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: BeautifyError(e as string), life: TOAST_DURATION });
          }
        });
    }, 500);
  };

  const inputTheme = activeTheme === 'dark-theme' ? 'dark-input' : 'light-input';

  return (
    <div className="reset-password-screen-wrapper">
      <div className="reset-password-content-wrapper">
        <div className="title xxlargeBold">Zermatt</div>
        <div className="subtitle smallRegular">{slogan}</div>
        {settingNewPassword ? (
          <>
            <InputText
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`reset-password-input m-b-md ${error && 'p-invalid'} ${inputTheme}`}
            />
            <InputText
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`reset-password-input m-b-md ${error && 'p-invalid'} ${inputTheme}`}
            />
            <Button className="smallBold m-b-md" onClick={resetPassword} disabled={buttonDisabled} loading={loading}>
              Reset Password
            </Button>
          </>
        ) : (
          <>
            <InputText type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={`reset-password-input m-b-md ${inputTheme}`} />
            <Button className="smallBold m-b-md" onClick={requestNewPassword} disabled={!allowResend && buttonDisabled} loading={loading}>
              Reset Password
            </Button>
          </>
        )}

        <div className="reset-password-text-wrapper smallRegular">
          Back to
          <span className="reset-password-text mediumMedium clickable no-select" onClick={() => navigate('/sign-in')}>
            Sign-In
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
