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
    // Only initialize once when component first mounts
    const initializeAuth = async () => {
      await initialize();
    };

    initializeAuth();

    // Setup Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Only process Firebase auth changes after initialization is complete
      const { isInitialized, isAuthenticated } = useAuthStore.getState();
      
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
        // Firebase user is null - only clear if we're not authenticated
        // This prevents clearing session when user logged in without remember me
        if (!isAuthenticated) {
          setUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []); // Empty dependency array - only run once

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
