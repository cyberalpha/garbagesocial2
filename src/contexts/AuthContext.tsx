
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface Profile {
  id: string;
  name: string;
  type: 'individual' | 'organization';
  avatar_url?: string;
  positive_ratings: number;
  negative_ratings: number;
  neutral_ratings: number;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signUp: (email: string, password: string, name: string, type: 'individual' | 'organization') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  userLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    // Get the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch profile when user changes
  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setProfile(null);
        setUserLoading(false);
        return;
      }

      try {
        setUserLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setUserLoading(false);
      }
    }

    // Use setTimeout to prevent the auth update/profile fetch cycle
    if (user) {
      setTimeout(() => {
        fetchProfile();
      }, 0);
    } else {
      setUserLoading(false);
    }
  }, [user]);

  const signUp = async (email: string, password: string, name: string, type: 'individual' | 'organization') => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            type
          }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Registro exitoso",
        description: "Se ha enviado un email de confirmación a tu correo.",
      });

      if (data.session) {
        navigate('/');
      }
    } catch (error: any) {
      let errorMessage = "Error en el registro";
      if (error.message === "User already registered") {
        errorMessage = "El usuario ya está registrado";
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error signing up:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de nuevo",
      });
      
      navigate('/');
    } catch (error: any) {
      let errorMessage = "Error en el inicio de sesión";
      if (error.message === "Invalid login credentials") {
        errorMessage = "Credenciales inválidas";
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      navigate('/auth');
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    signUp,
    signIn,
    signOut,
    loading,
    userLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
