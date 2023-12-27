import { useMutation, useQueryClient } from 'react-query';
import { _signin, _signup, _getUserIDFromDatabase, _sendVerificationEmail } from '../api';
import { AppThemes, Firebase_Extended_User_Props, Local_User_Props, initialTheme } from '../utils';
import { useContext } from 'react';
import { PrimeReactContext } from 'primereact/api';

// ------------------ User API Hook ------------------
export const userAPIHook = () => {
  const queryClient = useQueryClient();

  const signUpAPIMutation = useMutation({
    mutationFn: _signup,
    onSuccess: async (user: Firebase_Extended_User_Props | null) => {
      console.log('signUpAPIMutation success', user);

      if (user?.emailVerified) await _getUserIDFromDatabase();
      else await _sendVerificationEmail().catch((e) => console.log(e));
    },
    // eslint-disable-next-line
    onError: (error: any) => {
      console.log('signUpAPIMutation onError: ', error);
    },
  });

  const signInAPIMutation = useMutation({
    mutationFn: _signin,
    onSuccess: async (user: Firebase_Extended_User_Props | null) => {
      console.log('signInAPIMutation success', user);
      if (user?.emailVerified) await _getUserIDFromDatabase();
    },
    // eslint-disable-next-line
    onError: (error: any) => {
      console.log('signInAPIMutation onError: ', error);
    },
  });

  const setUser = (user: Local_User_Props | null) => {
    queryClient.setQueryData('user', user || null);
  };

  const getUser = (): Local_User_Props | null => {
    return queryClient.getQueryData('user') || null;
  };

  return { signUpAPIMutation, signInAPIMutation, setUser, getUser };
};

// ------------------ Theme Hook ------------------
export const themeHook = () => {
  const queryClient = useQueryClient();

  // eslint-disable-next-line
  const { changeTheme } = useContext(PrimeReactContext);

  // Toggles the app theme
  const toggleTheme = (): boolean => {
    const oldTheme: AppThemes = getTheme();
    const newTheme: AppThemes = oldTheme === 'dark-theme' ? 'light-theme' : 'dark-theme';
    return applyTheme({ oldTheme, newTheme });
  };

  // Set the app theme
  const setTheme = (newTheme: AppThemes) => {
    const oldTheme: AppThemes = newTheme === 'dark-theme' ? 'light-theme' : 'dark-theme';
    applyTheme({ oldTheme, newTheme });
    return true;
  };

  // Apply the app theme
  const applyTheme = ({ oldTheme, newTheme }: { oldTheme: AppThemes; newTheme: AppThemes }) => {
    checkForDuplicateIds();
    if (changeTheme) {
      changeTheme(oldTheme, newTheme, 'theme-link');
      localStorage.setItem('theme', newTheme);
      queryClient.setQueryData('theme', newTheme);
      return true;
    }
    return false;
  };

  // Not sure why, but 'changeTheme' adds duplicate ids to the DOM for `theme-link`
  const checkForDuplicateIds = () => {
    const foundElements = document.querySelectorAll('#theme-link');
    if (foundElements && foundElements.length > 1) {
      foundElements.forEach((element, index) => {
        if (index > 0) element.remove();
      });
    }
  };

  // Returns app theme
  const getTheme = (): AppThemes => {
    let theme: AppThemes = localStorage.getItem('theme') as AppThemes;

    // If no theme found, set one
    if (!theme) {
      theme = initialTheme;
      setTheme(theme);
    }

    return theme;
  };

  return { getTheme, setTheme, toggleTheme };
};
