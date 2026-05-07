"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, GraduationCap, ShieldCheck } from "lucide-react";

export default function AuthPage() {
  const { login, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Authenticates user and triggers role-based redirect in AuthContext
        await login(email, password);
      } else {
        // Registers user in Supabase with metadata role
        await signUp(email, password, role);
        toast.success("Account created successfully! Please sign in.");
        setIsLogin(true); // Switch to login view
      }
    } catch (error) {
      // Error is caught here, but AuthContext already handles the toast
      console.error("Authentication process error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-extrabold text-center text-slate-900">
            {isLogin ? "Sign In" : "Register"}
          </CardTitle>
          <CardDescription className="text-center text-slate-500">
            {isLogin 
              ? "Access the School Broadcasting Portal" 
              : "Join as a Teacher or Principal"}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">School Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@school.edu" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-visible:ring-indigo-600"
              />
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:ring-indigo-600"
              />
            </div>

            {/* Role Selection (Only shown during Registration) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <div className="relative">
                  <select 
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="teacher">Teacher</option>
                    <option value="principal">Principal</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                    {role === "teacher" ? <GraduationCap size={18} /> : <ShieldCheck size={18} />}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all font-semibold" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Working...
                </span>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  // Optional: Reset form fields when switching
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Register here" 
                  : "Already registered? Sign in here"}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}