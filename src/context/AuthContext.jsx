import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setProfile(null);
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    setProfile(data);
    return data;
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    const loadSession = async (nextSession) => {
      setSession(nextSession);
      try {
        if (nextSession?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', nextSession.user.id)
            .maybeSingle();
          if (error) throw error;
          if (active) setProfile(data);
        } else if (active) {
          setProfile(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data }) => loadSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      loadSession(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return null;
    return fetchProfile(session.user.id);
  }, [fetchProfile, session?.user]);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    profile,
    loading,
    isConfigured,
    refreshProfile,
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    async signUp({ email, password, fullName, role }) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
          emailRedirectTo: `${location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    },
    async signOut() {
      await supabase.auth.signOut();
    },
    async resetPassword(email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/reset-password`,
      });
      if (error) throw error;
    },
    async updatePassword(password) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    },
  }), [session, profile, loading, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
