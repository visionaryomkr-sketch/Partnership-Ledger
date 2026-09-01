import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          // If credentials are not yet configured, finish loading so user can see UI and instructions
          setIsLoadingAuth(false);
          setAuthChecked(true);
          return;
        }

        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[Supabase Auth] Session error:', error);
          if (mounted) setAuthError({ type: 'auth_error', message: error.message });
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setIsAuthenticated(Boolean(initialSession?.user));
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      } catch (err) {
        console.error('[Supabase Auth] Unexpected error:', err);
        if (mounted) {
          setAuthError({ type: 'unknown', message: err.message });
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      }
    };

    initAuth();

    // Listen for auth changes (sign in, sign out, token refreshed)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(Boolean(currentSession?.user));
        setIsLoadingAuth(false);
        setAuthChecked(true);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please add your credentials to .env.local.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, metadata = {}) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please add your credentials to .env.local.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) throw error;

    // Automatically bind the partner email & phone in public.partners if matched
    if (metadata.full_name) {
      try {
        const payload = { email: email.toLowerCase().trim() };
        if (metadata.phone) payload.phone = metadata.phone;
        await supabase
          .from('partners')
          .update(payload)
          .ilike('name', `%${metadata.full_name.trim()}%`);
      } catch (bindErr) {
        console.warn('Auto-binding partner email/phone:', bindErr);
      }
    }

    return data;
  };

  const loginWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please add your credentials to .env.local.');
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  };

  const resetPassword = async (email) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please add your credentials to .env.local.');
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  };

  const updatePassword = async (newPassword) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please add your credentials to .env.local.');
    }
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('[Supabase Auth] Logout error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  const checkUserAuth = async () => {
    try {
      if (!isSupabaseConfigured) return;
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(Boolean(currentSession?.user));
    } catch (err) {
      console.error('[Supabase Auth] checkUserAuth error:', err);
    }
  };

  const [partnerProfile, setPartnerProfile] = useState(null);

  useEffect(() => {
    if (!user?.email || !isSupabaseConfigured) {
      setPartnerProfile(null);
      return;
    }

    const loadPartnerProfile = async () => {
      try {
        const { data } = await supabase
          .from('partners')
          .select('*')
          .eq('email', user.email.toLowerCase().trim())
          .maybeSingle();

        if (data) {
          setPartnerProfile({
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            color: data.color || '#4A5FE8',
          });
        }
      } catch (err) {
        console.warn('Error fetching partner profile:', err);
      }
    };

    loadPartnerProfile();
  }, [user]);

  const currentPartner = React.useMemo(() => {
    if (partnerProfile) return partnerProfile;

    const email = user?.email?.toLowerCase() || '';
    const fullName = (user?.user_metadata?.full_name || '').trim();
    const fullNameLower = fullName.toLowerCase();

    if (email === 'omkumar97678@gmail.com' || email.includes('omkumar') || fullNameLower.includes('om')) {
      return { id: 'om', name: 'OM Kumar', role: 'Developer', color: '#4A5FE8', email };
    }
    if (email.includes('shubham') || fullNameLower.includes('shubham')) {
      return { id: 'shubham', name: 'Shubham Jain', role: 'Ad Creative', color: '#D14F9C', email };
    }
    if (email.includes('ashwin') || fullNameLower.includes('ashwin')) {
      return { id: 'ashwin', name: 'Ashwin Pillai', role: 'Marketing', color: '#E8734A', email };
    }
    if (fullName) {
      return { id: 'custom', name: fullName, role: 'Co-Founder', color: '#1B4332', email };
    }
    return { id: 'om', name: 'OM Kumar', role: 'Developer', color: '#4A5FE8', email };
  }, [user, partnerProfile]);

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentPartner,
        session,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings: false,
        authError,
        authChecked,
        isSupabaseConfigured,
        login,
        signUp,
        loginWithGoogle,
        resetPassword,
        updatePassword,
        logout,
        navigateToLogin,
        checkUserAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
