import { useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { ref, set, get, serverTimestamp } from 'firebase/database';
import { auth, db, googleProvider } from '../lib/firebase';
import { useAppStore } from '../store/useAppStore';
import { User } from '../types';

export const useAuth = () => {
  const { setUser, setAuthLoading, addToast } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        };
        setUser(user);
        
        // Update user in RTDB
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);
        
        if (!snapshot.exists()) {
          await set(userRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            createdAt: serverTimestamp(),
            lastSeen: serverTimestamp(),
            plan: 'free'
          });
        } else {
          await set(userRef, {
            ...snapshot.val(),
            lastSeen: serverTimestamp()
          });
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setAuthLoading]);

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      addToast({ type: 'success', message: 'Signed in successfully' });
    } catch (err: any) {
      const message = mapAuthError(err.code);
      setError(message);
      addToast({ type: 'error', message });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(user, { displayName });
      
      // Create user in RTDB immediately
      await set(ref(db, `users/${user.uid}`), {
        uid: user.uid,
        email: user.email,
        displayName,
        photoURL: null,
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        plan: 'free'
      });

      await firebaseSendEmailVerification(user);
      addToast({ type: 'success', message: 'Account created! Please verify your email.' });
    } catch (err: any) {
      const message = mapAuthError(err.code);
      setError(message);
      addToast({ type: 'error', message });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      addToast({ type: 'success', message: 'Signed in with Google' });
    } catch (err: any) {
      const message = mapAuthError(err.code);
      setError(message);
      addToast({ type: 'error', message });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      addToast({ type: 'info', message: 'Signed out' });
    } catch (err: any) {
      console.error(err);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      addToast({ type: 'success', message: 'Password reset email sent' });
    } catch (err: any) {
      const message = mapAuthError(err.code);
      setError(message);
      addToast({ type: 'error', message });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendEmailVerification = async () => {
    if (auth.currentUser) {
      try {
        await firebaseSendEmailVerification(auth.currentUser);
        addToast({ type: 'success', message: 'Verification email sent' });
      } catch (err: any) {
        const message = mapAuthError(err.code);
        addToast({ type: 'error', message });
      }
    }
  };

  const updateUserEmail = async (email: string) => {
    if (auth.currentUser) {
      setLoading(true);
      try {
        // @ts-ignore - updateEmail is not exported from firebase/auth in the import above, need to add it
        const { updateEmail } = await import('firebase/auth');
        await updateEmail(auth.currentUser, email);
        
        // Update in RTDB
        await set(ref(db, `users/${auth.currentUser.uid}/email`), email);
        
        addToast({ type: 'success', message: 'Email updated successfully' });
      } catch (err: any) {
        const message = mapAuthError(err.code);
        addToast({ type: 'error', message });
        throw err;
      } finally {
        setLoading(false);
      }
    }
  };

  const updateUserPassword = async (password: string) => {
    if (auth.currentUser) {
      setLoading(true);
      try {
        // @ts-ignore
        const { updatePassword } = await import('firebase/auth');
        await updatePassword(auth.currentUser, password);
        addToast({ type: 'success', message: 'Password updated successfully' });
      } catch (err: any) {
        const message = mapAuthError(err.code);
        addToast({ type: 'error', message });
        throw err;
      } finally {
        setLoading(false);
      }
    }
  };

  const updateUserProfile = async (profile: { displayName?: string; photoURL?: string }) => {
    if (auth.currentUser) {
      setLoading(true);
      try {
        await updateProfile(auth.currentUser, profile);
        
        // Update in RTDB
        if (profile.displayName) {
          await set(ref(db, `users/${auth.currentUser.uid}/displayName`), profile.displayName);
        }
        if (profile.photoURL) {
          await set(ref(db, `users/${auth.currentUser.uid}/photoURL`), profile.photoURL);
        }

        // Update local state
        setUser({
          ...useAppStore.getState().user!,
          ...profile
        });

        addToast({ type: 'success', message: 'Profile updated successfully' });
      } catch (err: any) {
        const message = mapAuthError(err.code);
        addToast({ type: 'error', message });
        throw err;
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    sendEmailVerification,
    updateUserEmail,
    updateUserPassword,
    updateUserProfile,
    loading,
    error
  };
};

const mapAuthError = (code: string) => {
  switch (code) {
    case 'auth/invalid-email': return 'Invalid email address.';
    case 'auth/user-disabled': return 'This account has been disabled.';
    case 'auth/user-not-found': return 'No account found with this email.';
    case 'auth/wrong-password': return 'Incorrect password.';
    case 'auth/email-already-in-use': return 'Email is already in use.';
    case 'auth/weak-password': return 'Password should be at least 6 characters.';
    case 'auth/popup-closed-by-user': return 'Sign in cancelled.';
    default: return 'An error occurred. Please try again.';
  }
};
