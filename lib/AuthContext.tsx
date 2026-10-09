'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface AdminUser {
  id: string;
  firebase_uid: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  photo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Validates the authenticated Firebase user against Cloud Firestore (/admins/{uid}).
 * Requires:
 * 1. Document /admins/{uid} exists
 * 2. isActive === true
 * 3. role === "admin" (or "super_admin")
 */
async function verifyAdminInFirestore(fbUser: FirebaseUser): Promise<AdminUser | null> {
  try {
    const adminDocRef = doc(db, 'admins', fbUser.uid);
    const adminDocSnap = await getDoc(adminDocRef);

    if (!adminDocSnap.exists()) {
      return null;
    }

    const data = adminDocSnap.data();

    const isActive = data.isActive === true;
    const rawRole = typeof data.role === 'string' ? data.role.toLowerCase().trim() : '';
    const isRoleAllowed = rawRole === 'admin' || rawRole === 'super_admin';

    if (!isActive || !isRoleAllowed) {
      return null;
    }

    const derivedName = data.name || fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Administrator');

    let createdAtStr: string | undefined;
    if (data.createdAt) {
      if (typeof data.createdAt.toDate === 'function') {
        createdAtStr = data.createdAt.toDate().toISOString();
      } else if (typeof data.createdAt === 'string') {
        createdAtStr = data.createdAt;
      }
    } else {
      createdAtStr = fbUser.metadata.creationTime;
    }

    let updatedAtStr: string | undefined;
    if (data.updatedAt) {
      if (typeof data.updatedAt.toDate === 'function') {
        updatedAtStr = data.updatedAt.toDate().toISOString();
      } else if (typeof data.updatedAt === 'string') {
        updatedAtStr = data.updatedAt;
      }
    }

    return {
      id: fbUser.uid,
      firebase_uid: fbUser.uid,
      email: data.email || fbUser.email || '',
      name: derivedName,
      role: data.role || 'admin',
      isActive: true,
      photo_url: fbUser.photoURL || null,
      created_at: createdAtStr,
      updated_at: updatedAtStr,
    };
  } catch (err) {
    console.error('Error verifying admin authorization in Firestore:', err);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    if (!auth?.currentUser) {
      setUser(null);
      setFirebaseUser(null);
      setLoading(false);
      return;
    }

    const admin = await verifyAdminInFirestore(auth.currentUser);
    if (admin) {
      setUser(admin);
      setFirebaseUser(auth.currentUser);
      setAuthError(null);
    } else {
      await signOut(auth).catch(() => {});
      setUser(null);
      setFirebaseUser(null);
      setAuthError('You are not authorized to access the admin panel.');
    }
    setLoading(false);
  }, []);

  // Subscribe to Firebase Auth state changes & verify Firestore admin authorization
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        const admin = await verifyAdminInFirestore(fbUser);
        if (admin) {
          setFirebaseUser(fbUser);
          setUser(admin);
          setAuthError(null);
        } else {
          // Deny access if not in Firestore /admins collection or inactive
          await signOut(auth).catch(() => {});
          setFirebaseUser(null);
          setUser(null);
          setAuthError('You are not authorized to access the admin panel.');
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Firebase Email/Password Sign-In + Firestore Authorization Check
  const login = async (email: string, password: string) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;

      // Check Firestore /admins/{uid}
      const admin = await verifyAdminInFirestore(fbUser);
      if (!admin) {
        await signOut(auth).catch(() => {});
        setUser(null);
        setFirebaseUser(null);
        const unauthorizedMsg = 'You are not authorized to access the admin panel.';
        setAuthError(unauthorizedMsg);
        throw new Error(unauthorizedMsg);
      }

      setFirebaseUser(fbUser);
      setUser(admin);
      router.push('/admin');
    } catch (err: any) {
      let message = 'Invalid email or password.';
      if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/invalid-email'
      ) {
        message = 'Invalid email or password.';
      } else if (err?.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Please try again in a few minutes.';
      } else if (err?.code === 'auth/user-disabled') {
        message = 'This admin account has been disabled in Firebase Console.';
      } else if (err?.message === 'You are not authorized to access the admin panel.') {
        message = 'You are not authorized to access the admin panel.';
      } else if (err?.message) {
        message = err.message;
      }

      setAuthError(message);
      throw new Error(message);
    }
  };

  // Firebase Sign-Out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setFirebaseUser(null);
      setAuthError(null);
      router.push('/admin/login');
    }
  };

  // Route protection redirect
  useEffect(() => {
    if (!loading) {
      const isAdminRoute = pathname?.startsWith('/admin');
      const isLoginPage = pathname === '/admin/login';

      if (isAdminRoute && !isLoginPage && !user) {
        router.push('/admin/login');
      } else if (isLoginPage && user) {
        router.push('/admin');
      }
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        authError,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
