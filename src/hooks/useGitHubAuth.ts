import { useState, useEffect } from 'react';
import { signInWithPopup, linkWithPopup, GithubAuthProvider, UserCredential } from 'firebase/auth';
import { ref, set, get, remove } from 'firebase/database';
import { auth, githubProvider, rtdb } from '../lib/firebase';
import { useAppStore } from '../store/useAppStore';
import { useEditorStore } from '../store/useEditorStore';

interface GitHubUser {
  login: string;
  name: string;
  avatarUrl: string;
  token: string;
}

interface UseGitHubAuth {
  githubUser: GitHubUser | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectGitHub: () => Promise<void>;
  disconnectGitHub: () => Promise<void>;
  error: string | null;
}

export function useGitHubAuth(): UseGitHubAuth {
  const { user } = useAppStore();
  const { githubUser, setGithubUser } = useEditorStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load GitHub user from RTDB on mount/user change
  useEffect(() => {
    if (!user) {
      setGithubUser(null);
      return;
    }

    const loadGitHubUser = async () => {
      try {
        const snapshot = await get(ref(rtdb, `users/${user.uid}/github`));
        if (snapshot.exists()) {
          setGithubUser(snapshot.val());
        } else {
          setGithubUser(null);
        }
      } catch (err) {
        console.error('Error loading GitHub user:', err);
      }
    };

    loadGitHubUser();
  }, [user, setGithubUser]);

  const connectGitHub = async () => {
    if (!user) {
      setError('You must be signed in to connect GitHub.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      let credential: UserCredential;
      
      // If user is anonymous, we might want to link, but for now let's just sign in/link
      // Note: If the user is already signed in with Google/Email, we link the account.
      // If they are anonymous, we might upgrade them.
      // However, the simplest flow for now is to use linkWithPopup if a user exists.
      
      try {
        if (auth.currentUser) {
          credential = await linkWithPopup(auth.currentUser, githubProvider);
        } else {
          // Should not happen if user is logged in, but fallback to sign in
          credential = await signInWithPopup(auth, githubProvider);
        }
      } catch (linkError: any) {
        // If the credential is already in use, we might need to sign in with it?
        // Or if the provider is already linked.
        if (linkError.code === 'auth/credential-already-in-use') {
           setError('This GitHub account is already connected to another user.');
           setIsConnecting(false);
           return;
        } else if (linkError.code === 'auth/provider-already-linked') {
          // Already linked, just need to get the token.
          // We can't easily get a fresh token without re-auth if it's not in the credential result.
          // So we might need to re-authenticate.
          // For simplicity, let's try signInWithPopup which might return the same user if configured right,
          // but usually linkWithPopup is what we want.
          
          // If already linked, we might just need to re-login to get the access token?
          // Actually, linkWithPopup throws if already linked.
          // Let's try to just get the token via re-authentication or assume we need to re-link.
          
          // Strategy: If already linked, we can't get the access token easily without a fresh sign-in.
          // Let's ask the user to sign in with GitHub to refresh the token.
           credential = await signInWithPopup(auth, githubProvider);
        } else {
          // Fallback to sign in if linking fails for other reasons (e.g. not supported)
          // But be careful not to overwrite the current user session if it's a different user.
          throw linkError;
        }
      }

      // Extract OAuth token
      const credential_any = credential as any;
      const token = GithubAuthProvider.credentialFromResult(credential)?.accessToken;

      if (!token) {
        throw new Error('Failed to get GitHub access token.');
      }

      // Fetch user details from GitHub
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch GitHub user profile.');
      }

      const githubProfile = await response.json();
      
      const newGitHubUser: GitHubUser = {
        login: githubProfile.login,
        name: githubProfile.name || githubProfile.login,
        avatarUrl: githubProfile.avatar_url,
        token: token
      };

      // Store in RTDB (securely under user's node)
      await set(ref(rtdb, `users/${user.uid}/github`), {
        ...newGitHubUser,
        connectedAt: Date.now()
      });

      setGithubUser(newGitHubUser);
    } catch (err: any) {
      console.error('GitHub connection error:', err);
      setError(err.message || 'Failed to connect GitHub.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectGitHub = async () => {
    if (!user) return;

    try {
      // Remove from RTDB
      await remove(ref(rtdb, `users/${user.uid}/github`));
      
      // Update local state
      setGithubUser(null);
      
      // Note: We don't unlink from Firebase Auth to avoid complicating the auth flow
      // (e.g. if they only have GitHub linked, unlinking would lock them out).
      // We just remove the token/profile from our app's storage.
    } catch (err: any) {
      console.error('GitHub disconnection error:', err);
      setError(err.message || 'Failed to disconnect GitHub.');
    }
  };

  return {
    githubUser,
    isConnected: !!githubUser,
    isConnecting,
    connectGitHub,
    disconnectGitHub,
    error
  };
}
