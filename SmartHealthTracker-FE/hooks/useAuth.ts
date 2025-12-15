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
    // initialize();
    const initializeAuth = async () => {
      await initialize();
    };

    initializeAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        useAuthStore.getState().setToken(token);
      }
      setUser(firebaseUser);
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
