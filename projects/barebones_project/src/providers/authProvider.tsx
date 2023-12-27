import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import LoadingScreen from '../screens/loading-screen';
import { userAPIHook } from '../hooks';
import { Firebase_Extended_User_Props, Local_User_Props } from '../utils';
import { useQuery } from 'react-query';
import { _getAccessToken, _getUserIDFromDatabase } from '../api';

interface AuthContextType {
  user: Local_User_Props | null;
}

const AuthContext = createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, getUser } = userAPIHook();
  const { data: user } = useQuery('user', getUser);
  let modifiedUser: Local_User_Props | null = null;

  // const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (currentUser) => {
      const handler = async () => {
        if (currentUser) {
          const userFromDatabase = await _getUserIDFromDatabase().catch((e) => console.log('error: ', e));
          const accessToken = await _getAccessToken({});
          currentUser = currentUser as Firebase_Extended_User_Props;

          modifiedUser = {
            accessToken,
            emailVerified: currentUser?.emailVerified || false,
            email: currentUser?.email || '',
            firebaseUid: currentUser?.uid || '',
            firstName: userFromDatabase?.firstName || '',
            lastName: userFromDatabase?.lastName || '',
            _id: userFromDatabase?._id || '',
            image: currentUser?.photoURL || '',
          };
          setUser(modifiedUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      };

      handler().catch((e) => console.log('AuthProvider error: ', e));
    });

    // Remove listener
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const values = {
    user: user as Local_User_Props | null,
  };

  // Auth may fail if we return 'children' before 'loading' is completed, since auth may be null at that point
  return <AuthContext.Provider value={values}>{loading ? <LoadingScreen /> : children}</AuthContext.Provider>;
}

function useAuth() {
  return useContext(AuthContext);
}

export { useAuth, AuthProvider, AuthContext };
