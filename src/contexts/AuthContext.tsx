import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../api/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { User } from '../types';
import { NotificationManager } from '../utils/notificationManager';
import { sendToWebhook } from '../utils/webhookService';

// Re-export the User type for backward compatibility
export type { User };

interface AuthContextType {
  user: User | null;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, planType?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Add currentUser as an alias for user for backward compatibility
  const { user, ...rest } = context;
  return {
    ...rest,
    user,
    currentUser: user, // Alias for backward compatibility
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Create a basic user from Firebase auth
  const createBasicUser = useCallback((firebaseUser: FirebaseUser): User => {
    const trialStartDate = new Date();
    const trialEndDate = new Date(trialStartDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    return {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email || '',
      membershipStatus: 'trial',
      trialStartDate,
      trialEndDate,
      subscriptionType: 'trial',
      avatar: firebaseUser.photoURL || undefined,
      role: 'user',
      airtableId: firebaseUser.uid,
      emailVerified: firebaseUser.emailVerified,
      emailNotifications: true,
      trialReminders: true,
    };
  }, []);

  // Sync user data from Firebase
  const syncUser = useCallback(
    async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      setLoading(true);
      try {
        const userData = createBasicUser(firebaseUser);
        setUser(userData);

        // Check for trial notifications
        NotificationManager.checkTrialNotifications(userData);

        // Create welcome notification for new users
        if (
          userData.trialStartDate &&
          new Date().getTime() - userData.trialStartDate.getTime() < 24 * 60 * 60 * 1000
        ) {
          NotificationManager.createWelcomeNotification(userData);
        }
      } catch (error) {
        console.error('Error syncing user:', error);
      } finally {
        setLoading(false);
      }
    },
    [createBasicUser],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      syncUser(firebaseUser);
    });

    return () => unsubscribe();
  }, [syncUser]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      await syncUser(firebaseUser);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, planType: string = 'trial') => {
    setLoading(true);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      if (firebaseUser) {
        await firebaseUpdateProfile(firebaseUser, { displayName: name });
        
        // Set the user's plan type in their profile
        const now = new Date();
        const trialEndDate = new Date(now);
        trialEndDate.setDate(now.getDate() + 14);
        
        const userData: Partial<User> = {
          name,
          email,
          membershipStatus: planType === 'trial' ? 'trial' : 'active',
          subscriptionType: planType,
          trialStartDate: now,
          trialEndDate: planType === 'trial' ? trialEndDate : undefined,
        };
        
        const userWithData = { ...firebaseUser, displayName: name, ...userData };
        await syncUser(userWithData);
        
        // Send registration data to Make.com webhook
        await sendToWebhook({
          event: 'user_registered',
          userId: firebaseUser.uid,
          email,
          name,
          planType,
          registrationDate: now.toISOString(),
          trialEndDate: planType === 'trial' ? trialEndDate.toISOString() : null,
          source: 'web'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const { user: firebaseUser } = await signInWithPopup(auth, provider);
      await syncUser(firebaseUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!auth.currentUser) return;

    // Update Firebase profile if name or photoURL is being updated
    const updates: { displayName?: string; photoURL?: string } = {};
    if (data.name) updates.displayName = data.name;
    if (data.avatar) updates.photoURL = data.avatar;

    if (Object.keys(updates).length > 0) {
      await firebaseUpdateProfile(auth.currentUser, updates);
    }

    // Update local user state
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
    }
  };

  const contextValue = {
    user,
    currentUser: user, // Alias for backward compatibility
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    loading,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
