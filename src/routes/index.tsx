// Screens
import ErrorScreen from '../screens/error-screen';
import SignIn from '../screens/sign-in';
import SignUp from '../screens/sign-up';
import EmailVerification from '../screens/email-verification';
import Verify from '../screens/verify';
import ResetPassword from '../screens/reset-password';

// Imports
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/authProvider';

// Wrap protected routes with this
// function Protected({ children }: { children: JSX.Element }) {
//   const auth = useAuth();
//   const location = useLocation();

//   // If this doesn't seem to be working, check that auth is fully loaded beforehand.
//   if (!auth.user || !auth.user.emailVerified) {
//     /**
//      *  Redirect them to the /sign-in page, but save the current location they were
//      *  trying to go to when they were redirected. This allows us to send them along
//      *  to that page after they login, which is a nicer user experience
//      *  than dropping them off on the home page.
//      */
//     console.log('User does not have auth');
//     return <Navigate to="/sign-in" state={{ from: location }} replace />;
//   }

//   return children;
// }

// Wrap protected routes with this
function Middleware({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();
  const welcomePages =
    location.pathname === '/' || location.pathname === '/sign-in' || location.pathname === '/sign-up' || location.pathname === '/reset-password' || location.pathname === '/email-verification';

  // If the user has auth, but tries to access welcome pages
  if (auth.user && auth.user.emailVerified && welcomePages) {
    return <Navigate to="/chat" state={{ from: location }} replace />;
  }

  return children;
}

const routes = [
  {
    path: '/',
    element: (
      <Middleware>
        <SignIn />
      </Middleware>
    ),
    errorElement: <ErrorScreen />,
  },
  {
    path: '/sign-in',
    element: (
      <Middleware>
        <SignIn />
      </Middleware>
    ),
    errorElement: <ErrorScreen />,
  },
  {
    path: '/sign-up',
    element: (
      <Middleware>
        <SignUp />
      </Middleware>
    ),
    errorElement: <ErrorScreen />,
  },
  {
    path: '/reset-password',
    element: (
      <Middleware>
        <ResetPassword />
      </Middleware>
    ),
    errorElement: <ErrorScreen />,
  },
  {
    path: '/email-verification',
    element: (
      <Middleware>
        <EmailVerification />
      </Middleware>
    ),
    errorElement: <ErrorScreen />,
  },
  {
    path: '/verify',
    element: (
      <Middleware>
        <Verify />
      </Middleware>
    ),
    errorElement: <ErrorScreen />,
  },

  {
    path: '/error',
    element: (
      <Middleware>
        <ErrorScreen />
      </Middleware>
    ),
    errorElement: <ErrorScreen />,
  },
];

export default routes;
