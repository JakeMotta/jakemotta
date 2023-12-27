import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';
import { themeHook } from './hooks/reactQuery';
import './index.scss';

const router = createBrowserRouter(routes);

function App() {
  // eslint-disable-next-line
  const { getTheme, setTheme } = themeHook();

  // On load, create a user id
  useEffect(() => {
    const handler = async () => {
      // eslint-disable-next-line
      const foundTheme = await getTheme();
      // eslint-disable-next-line
      setTheme(foundTheme);
    };

    handler().catch((e) => console.log(e));
  }, []);

  return (
    <div className="screen-wrapper">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
