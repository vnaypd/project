import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../utils/firebase';
import { signInWithPopup, signOut as firebaseSignOut, User } from 'firebase/auth';

interface AuthContextType {
     user: User | null;
     loading: boolean;
     signInWithGoogle: () => Promise<void>;
     signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
               setUser(user);
               setLoading(false);
          });
          return unsubscribe;
     }, []);

     const signInWithGoogle = async () => {
          try {
               await signInWithPopup(auth, googleProvider);
          } catch (error) {
               console.error("Google sign-in error:", error);
          }
     };

     const signOut = async () => {
          try {
               await firebaseSignOut(auth);
          } catch (error) {
               console.error("Sign out error:", error);
          }
     };

     return (
          <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
               {children}
          </AuthContext.Provider>
     );
};

export const useAuth = () => {
     const context = useContext(AuthContext);
     if (context === undefined) {
          throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
};