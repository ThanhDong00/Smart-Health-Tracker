import { auth } from "@/config/firebase";
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

export const authService = {
  // Sign up
  async signUp(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  },

  // Sign in
  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  },

  // Sign out
  async signOut(): Promise<void> {
    await signOut(auth);
  },

  // Send password reset email
  async sendPasswordResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  // Confirm reset password with OTP
  async confirmPasswordReset(
    oobCode: string,
    newPassword: string
  ): Promise<void> {
    await confirmPasswordReset(auth, oobCode, newPassword);
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  },
};
