import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../components/auth/supabaseClient'

interface User {
id: string;
firstName: string;
lastName: string
email: string;
}

interface AuthContextType {
user: User | null;
isAuthenticated: boolean;
isLoading: boolean;
login: (email: string, password: string) => Promise<boolean>;
register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
const [lastSignupTime, setLastSignupTime] = useState<number | null>(null);
const [lastLoginTime, setLastLoginTime] = useState<number | null>(null);
const COOLDOWN_DURATION = 10 * 1000; // 10 seconds cooldown
const [user, setUser] = useState<User | null>(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const getUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user;

    if (currentUser) {
      // Fetch profile from the 'profiles' table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', currentUser.id)
        .single();

      const firstName = profile?.first_name || currentUser.email?.split('@')[0] || '';
      const lastName = profile?.last_name || '';

      // Save to state
      setUser({
        id: currentUser.id,
        firstName,
        lastName,
        email: currentUser.email || '',
      });

      // Save to localStorage (optional fallback)
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);
    }

    setIsLoading(false);
  };

  getUser();

  // Listener for auth state change
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      getUser(); // Re-fetch user info
    } else {
      setUser(null);
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
    }
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);

// useEffect(() => {
// const getUser = async () => {
// const { data: { session } } = await supabase.auth.getSession();
// const currentUser = session?.user;

// if (currentUser) {
// setUser({
// id: currentUser.id,
// firstName: currentUser.email?.split('@')[0] || '',
// lastName: currentUser.email?.split('@')[0] || '',
// email: currentUser.email || '',
// });
// }
// setIsLoading(false);
// };

// getUser();

// const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
// if (session?.user) {
// setUser({
// id: session.user.id,
// // firstName: session.user.email?.split('@')[0] || '',
// firstName: session.user.first_name,
// lastName: session.user.email?.split('@')[0] || '',
// email: session.user.email || '',
// });
// } else {
// setUser(null);
// }
// });
 
// return () => {
// listener.subscription.unsubscribe();
// };
// }, []);

  const login = async (
    email: string, 
    password: string
  ): Promise<boolean> => {

    //  const now = Date.now();

    // if (lastLoginTime && now - lastLoginTime < COOLDOWN_DURATION) {
    //   console.warn('Login blocked due to cooldown');
    //   return false;
    // }

  // setLastLoginTime(now); // Set cooldown timer

    const { error } = await supabase.auth.signInWithPassword({      
      email,   
      password 
    });
    return !error;
  };

  const register = async (
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string
  ): Promise<boolean> => {

    //  const now = Date.now();

    // if (lastSignupTime && now - lastSignupTime < COOLDOWN_DURATION) {
    //  console.warn('Signup blocked due to cooldown');
    //  return false;
    // }

    // setLastSignupTime(now); // Set cooldown timer

    try {
      //sign up user via supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error || !data.user) {
        return false;
      }

      // If email confirmation is enabled, don't insert profile yet
      if (!data.user?.id || !data.session) {
        console.log("Awaiting email confirmation. Skipping profile insert.");
        return true;
      }

      // Insert into profiles table
      const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: data.user.id,
        first_name: firstName,
        last_name: lastName
      },
    ]);

    if (profileError) {
      console.error('Error saving profile:', profileError.message);
      return false;
    }

    return true;
    } catch (err) {
      console.error('Registration failed:', err);
      return false;
    } 
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('firstName')
    localStorage.clear()
  };

  return (
  <AuthContext.Provider value={{
  user,
  isAuthenticated: !!user,
  isLoading,
  login,
  register,
  logout
  }}>
  {children}
  </AuthContext.Provider>
  );
  };

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
  };
