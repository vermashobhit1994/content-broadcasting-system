"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // ----------------- initial session check -------------------------
        const initializeAuth = async () => {
            const {data, error} = await supabase.auth.getSession();
            setUser(data.session?.user ?? null);
            setLoading(false);
        };
        //-------------------------------------------------------------------

        // global listner for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            },
        );

        initializeAuth();
        return () => listener.subscription.unsubscribe();
    }, []);

    /**
     * AUTHENTICATION: registration
     * @param {*} email
     * @param {*} password
     * @param {*} role
     * @returns
     */
    const signUp = async (email, password, role) => {
        try {
            const data = await AuthService.register(email, password, role);
            toast.success("Registration successful!");
            return data;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    /**
     * AUTHENTICATION & AUTHORIZATION: Login
     */
    const login = async (email, password) => {
        let data;
        try {
            data = await AuthService.login(email, password);
            if(!data.user){
                toast.error("no user account exists");
            }
            
            // AUTHORIZATION: Extract role from JWT metadata
            const role = data.user?.user_metadata?.role;


            if (!role) {
                toast.error("No role assigned to this user.");
                return;
            }
            // 2. Add a very slight delay or use 'replace' to force Next.js to re-evaluate
            // This ensures the cookies are set before the redirect happens
            toast.success(`Logging in as ${role}...`);


            if (role === "teacher") {
              // window.location.href="/teacher"
                // router.push("/test");
                router.push("/teacher")
                // toast.success("Welcom teacher");
            } else if (role === "principal") {
              // window.location.href="/principal"
                router.push("/principal");
                // toast.success("Welcome principal");
            } else {
                router.push("/");
            }

            return data;
        } catch (error) {
            console.log(error);
            toast.error(`${error.message}`);
            throw error;
        }
    };

    /**
     * AUTHENTICATION: Logout
     */
    const logout = async () => {
        try {
            await AuthService.logout();
            toast.success("Signed out");
            router.push("/");
        } catch (error) {
            toast.error("Error signing out");
        }
    };

    /**
     * HELPER: Check Authorization
     * Usage: checkRole('principal') returns true/false
     */
    const checkRole = (requiredRole) => {
        return user?.user_metadata?.role === requiredRole;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signUp, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
