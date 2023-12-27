import { Button } from 'primereact/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { _sendVerificationEmail } from '../../api';
import { TOAST_DURATION } from '../../utils/constants';
import { useToast } from '../../providers/toastProvider';
import './index.scss';

const EmailVerification = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [allowResend, setAllowResend] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const resendEmailVerification = () => {
    setLoading(true);
    setAllowResend(false);

    setTimeout(() => {
      setLoading(false);
      setAllowResend(true);

      if (toast) {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Resent email verification', life: TOAST_DURATION });
      }

      _sendVerificationEmail().catch((e) => {
        setAllowResend(true);
        setLoading(false);
        console.log(e);
      });
    }, 500);
  };

  return (
    <div className="email-verification-screen-wrapper">
      <div className="email-verification-content-wrapper">
        <div className="title xxlargeBold">Thanks for signing up!</div>
        <div className="subtitle smallRegular m-b-xxl">Before we continue, please verify your email</div>

        <div className="subtitle smallRegular m-b-sm">Don't see an email yet?</div>
        <Button className="smallBold m-b-sm" onClick={resendEmailVerification} disabled={!allowResend} loading={loading}>
          Resend Email Verification
        </Button>
        <div className="subtitle smallRegular  m-b-sm">or</div>

        <Button
          className="smallBold m-b-md"
          onClick={() => {
            navigate('/sign-in');
          }}
          severity="secondary"
        >
          Back to Sign In
        </Button>
      </div>
    </div>
  );
};

export default EmailVerification;
