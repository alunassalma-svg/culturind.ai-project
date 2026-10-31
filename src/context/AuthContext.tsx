import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, authConfigured } from '@/lib/supabase';
import type { AppState, AgeGroup, Mode, LearningStyle, Language, AccessibilitySettings, UserProfile } from '@/types';

interface AuthContextValue {
  syncStatus: 'idle' | 'saving' | 'saved' | 'error';
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  // Progress sync
  saveState: (state: AppState) => void;
  loadState: (user: User) => Promise<Partial<AppState> | null>;
  hasStoredProgress: (user: User) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapAuthError(message: string): string {
  if (message.includes('User already registered')) return 'An account with this email already exists. Try logging in instead.';
  if (message.includes('Invalid login credentials')) return 'Wrong email or password. Please try again.';
  if (message.includes('Email not confirmed')) return 'Please confirm your email before logging in.';
  if (message.includes('Password should be at least')) return 'Password must be at least 6 characters.';
  if (message.includes('Unable to validate email address')) return 'Please enter a valid email address.';
  return message;
}

interface ProfileRow {
  nickname: string;
  avatar_seed: string;
  avatar_pattern: string;
  avatar_color: string;
  age_group: string;
  mode: string;
  points: number;
  streak: number;
  badges: string[];
  favorite_club: string | null;
}

interface ProgressRow {
  completed_legends: string[];
  quiz_scores: Record<string, number>;
  completed_irl: string[];
  language_progress: Record<string, boolean>;
  dance_progress: Record<string, { completed: boolean; lastStep: number }>;
  impact_counts: { familyConversations?: number; legendsExplored?: number; danceStepsPracticed?: number };
  extra: Record<string, unknown>;
}

interface PreferencesRow {
  language: string;
  learning_style: string;
  accessibility: AccessibilitySettings;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [syncStatus, setSyncStatus] = useState<AuthContextValue['syncStatus']>('idle');
  useEffect(() => () => { if(saveTimer.current) clearTimeout(saveTimer.current); }, [user?.id]);

  useEffect(() => {
    if (!authConfigured) { setLoading(false); return; }
    let mounted = true;
    const timeout = window.setTimeout(() => { if (mounted) setLoading(false); }, 6000);

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    }).catch(() => { if (mounted) setLoading(false); });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      (async () => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      sub.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!authConfigured) return {error: 'Accounts are not configured. You can keep exploring as a guest.'};
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: mapAuthError(error.message) };
    // If email confirmation is off, the user is immediately logged in.
    if (data.user && !data.session) {
      return { error: 'Account created! Please check your email to confirm, then log in.' };
    }
    return { error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!authConfigured) return {error: 'Accounts are not configured. You can keep exploring as a guest.'};
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: mapAuthError(error.message) };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    const {error} = await supabase.auth.signOut();
    if (error) throw new Error('Could not sign out. Please try again.');
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!authConfigured) return {error: 'Accounts are not configured.'};
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) return { error: mapAuthError(error.message) };
    return { error: null };
  }, []);

  const hasStoredProgress = useCallback(async (u: User): Promise<boolean> => {
    const { data } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('user_id', u.id)
      .maybeSingle();
    return !!data;
  }, []);

  const loadState = useCallback(async (u: User): Promise<Partial<AppState> | null> => {
    const [profileRes, progressRes, prefsRes] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('user_id', u.id).maybeSingle(),
      supabase.from('user_progress').select('*').eq('user_id', u.id).maybeSingle(),
      supabase.from('user_preferences').select('*').eq('user_id', u.id).maybeSingle(),
    ]);
    if ([profileRes, progressRes, prefsRes].some(result => result.error)) {
      setSyncStatus('error');
      throw new Error('Account progress could not be loaded. Local cache retained.');
    }

    if (profileRes.error && profileRes.error.code !== 'PGRST116') {
      console.error('loadState profile error:', profileRes.error);
    }

    const partial: Partial<AppState> = {};

    if (profileRes.data) {
      const p = profileRes.data as ProfileRow;
      partial.profile = {
        nickname: p.nickname,
        avatarSeed: p.avatar_seed,
        avatarPattern: p.avatar_pattern,
        avatarColor: p.avatar_color,
        points: p.points,
        streak: p.streak,
        badges: p.badges ?? [],
        favoriteClub: p.favorite_club,
      } satisfies UserProfile;
      partial.ageGroup = (p.age_group as AgeGroup) ?? null;
      partial.mode = (p.mode as Mode) ?? 'Explorer';
    }

    if (progressRes.data) {
      const pr = progressRes.data as ProgressRow;
      partial.impactCounts = {
        familyConversations: pr.impact_counts?.familyConversations ?? 0,
        legendsExplored: pr.impact_counts?.legendsExplored ?? 0,
        danceStepsPracticed: pr.impact_counts?.danceStepsPracticed ?? 0,
      };
      partial.progress = { completedLegends:pr.completed_legends ?? [], quizScores:pr.quiz_scores ?? {}, completedIrl:pr.completed_irl ?? [], languageProgress:pr.language_progress ?? {}, danceProgress:pr.dance_progress ?? {} };
    }

    if (prefsRes.data) {
      const pf = prefsRes.data as PreferencesRow;
      partial.language = (pf.language as Language) ?? 'EN';
      partial.learningStyle = (pf.learning_style as LearningStyle) ?? 'Visual';
      if (pf.accessibility) {
        partial.accessibility = pf.accessibility;
      }
    }

    return partial;
  }, []);

  const saveState = useCallback((state: AppState) => {
    if (!user) return;
    setSyncStatus('saving');
    const u = user;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const profileUpsert = {
        user_id: u.id,
        nickname: state.profile.nickname,
        avatar_seed: state.profile.avatarSeed,
        avatar_pattern: state.profile.avatarPattern,
        avatar_color: state.profile.avatarColor,
        age_group: state.ageGroup ?? 'adult',
        mode: state.mode,
        points: state.profile.points,
        streak: state.profile.streak,
        badges: state.profile.badges,
        favorite_club: state.profile.favoriteClub,
      };

      const progressUpsert = {
        user_id: u.id,
        completed_legends: state.progress.completedLegends,
        quiz_scores: state.progress.quizScores,
        completed_irl: state.progress.completedIrl,
        language_progress: state.progress.languageProgress,
        dance_progress: state.progress.danceProgress,
        impact_counts: state.impactCounts,
      };

      const prefsUpsert = {
        user_id: u.id,
        language: state.language,
        learning_style: state.learningStyle,
        accessibility: state.accessibility,
      };

      try { const results = await Promise.all([
        supabase.from('user_profiles').upsert(profileUpsert).eq('user_id', u.id),
        supabase.from('user_progress').upsert(progressUpsert).eq('user_id', u.id),
        supabase.from('user_preferences').upsert(prefsUpsert).eq('user_id', u.id),
      ]); setSyncStatus(results.some(result => result.error) ? 'error' : 'saved'); }
      catch { setSyncStatus('error'); }
    }, 1200);
  }, [user]);

  const value: AuthContextValue = {
    syncStatus,
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    saveState,
    loadState,
    hasStoredProgress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
