"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

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
        await login(email, password);
        // Redirect is handled inside AuthContext login logic
      } else {
        await signUp(email, password, role);
        toast.info("Registration successful. You can now log in.");
        setIsLogin(true); // Switch to login view after registering
      }
    } catch (error) {
      console.error("Auth error:", error);
      // AuthContext handles the toast error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? "Enter your credentials to access your dashboard" 
              : "Register as a teacher or principal to get started"}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@school.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role">I am a...</Label>
                <select 
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="teacher">Teacher</option>
                  <option value="principal">Principal</option>
                </select>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" type="submit" disabled={loading}>
              {loading ? "Processing..." : (isLogin ? "Sign In" : "Register")}
            </Button>
            
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-indigo-600 hover:underline"
            >
              {isLogin 
                ? "Don't have an account? Register here" 
                : "Already have an account? Log in here"}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}