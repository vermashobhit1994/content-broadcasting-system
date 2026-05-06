"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    getSession();
    return () => listener.subscription.unsubscribe();
  }, []);

  // Registration Logic
  const signUp = async (email, password, role) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: role }, // Attach role to metadata
      },
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }
    toast.success("Account created! Check email if confirmation is on.");
    return data;
  };

  // Login with Redirect
  const login = async (email, password) => {
    // .trim() removes accidental spaces at the beginning or end of the email
  const cleanEmail = email.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      toast.error("Auth Error: " + error.message);
      throw error;
    }

    // Direct redirection based on GoTrue metadata
    const role = data.user?.user_metadata?.role;
    if (role === "teacher") router.push("/teacher");
    else if (role === "principal") router.push("/principal");
    else router.push("/");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/"); // Redirect to home on signout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);