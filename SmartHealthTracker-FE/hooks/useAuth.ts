import { auth } from "@/config/firebase";
import { useAuthStore } from "@/store/auth.store";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    isInitialized,
    setUser,
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
    initialize,
  } = useAuthStore();

  useEffect(() => {
    let isInitialized = false;

    const initializeAuth = async () => {
      await initialize();
      isInitialized = true;
    };
    initializeAuth();

    // Setup Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isInitialized) {
        return;
      }

      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const currentToken = useAuthStore.getState().token;

        // Only update if token changed
        if (token !== currentToken) {
          await useAuthStore.getState().setToken(token);
        }

        // Update user object
        setUser(firebaseUser);
      } else {
        // Firebase user is null - only clear if we don't have a restored session
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
          setUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isInitialized,
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
  };
}
