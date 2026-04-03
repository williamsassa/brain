import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth';

/**
 * Hook for components that need to listen to auth state changes
 * Only use in components where auth is required
 * NOT for public pages (landing page, etc.)
 */
export const useAuth = () => {
  const { user, setUser, setLoading, logout } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Check if returning from OAuth redirect
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          console.log('✅ OAuth redirect result:', result.user.email);
          setUser(result.user);
        }
      })
      .catch((err) => {
        console.error('❌ Error getting redirect result:', err);
      });

    // IMPORTANT: Only set up listener when explicitly called
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('🔄 Auth state changed:', currentUser?.email || 'No user');
      setUser(currentUser);
      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { user, logout: handleLogout, initialized };
};

/**
 * Simple hook to check if user is authenticated
 * Use on protected pages
 */
export const useRequireAuth = (onUnauthenticated?: () => void) => {
  const { user } = useAuthStore();

  useEffect(() => {
    if (user === null) {
      onUnauthenticated?.();
    }
  }, [user, onUnauthenticated]);

  return user;
};
