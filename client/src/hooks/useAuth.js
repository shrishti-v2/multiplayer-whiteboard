import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { authAPI } from '../utils/api';

const useAuth = () => {
  const { user, token, isAuthenticated, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      authAPI
        .getMe()
        .then((response) => setUser(response.data.user))
        .catch(() => logout());
    }
  }, [token, user, setUser, logout]);

  return { user, token, isAuthenticated };
};

export default useAuth;
