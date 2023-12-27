import { ProgressSpinner } from 'primereact/progressspinner';
import { hexToRgba } from '../../utils';
import { useQuery } from 'react-query';
import { themeHook } from '../../hooks/reactQuery';
import { theme } from '../../utils/theme';
import './index.scss';

const LoadingScreen = () => {
  const { getTheme } = themeHook();

  const { data: activeTheme = 'light-theme' } = useQuery('theme', getTheme);

  return (
    <div className="loading-screen" style={{ backgroundColor: hexToRgba(theme[activeTheme].color.background, 0.75) }}>
      <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" fill="transparent" animationDuration="1.5s" />
    </div>
  );
};

export default LoadingScreen;
