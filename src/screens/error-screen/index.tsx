import { Button } from 'primereact/button';
import { useNavigate, useRouteError } from 'react-router-dom';
import './index.scss';

const ErrorScreen = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div id="error-screen">
      <div className="error-response-wrapper">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        {<p>{JSON.stringify(error)}</p>}
        <Button className="button" onClick={() => navigate('/')}>
          Go back
        </Button>
      </div>
    </div>
  );
};

export default ErrorScreen;
