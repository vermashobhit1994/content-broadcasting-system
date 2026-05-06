"use client";

import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Users, FileCheck, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Assuming you have a standard layout for your principal page
export default function PrincipalPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
      router.push("/"); // Redirects to the landing/login page
    } catch (error) {
      toast.error("An error occurred during sign out");
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <header className="flex justify-between items-center p-6 bg-white border-b shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Principal Panel</h1>
          <p className="text-sm text-slate-500">Welcome back, {user?.email}</p>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {/* Principal Dashboard Content Goes Here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border shadow-sm flex flex-col items-center gap-3">
             <Users className="text-indigo-600" size={32} />
             <h3 className="font-semibold">Manage Teachers</h3>
          </div>
          <div className="p-6 bg-white rounded-xl border shadow-sm flex flex-col items-center gap-3">
             <FileCheck className="text-green-600" size={32} />
             <h3 className="font-semibold">Review Content</h3>
          </div>
          <div className="p-6 bg-white rounded-xl border shadow-sm flex flex-col items-center gap-3">
             <Settings className="text-slate-600" size={32} />
             <h3 className="font-semibold">System Settings</h3>
          </div>
        </div>
      </main>
    </div>
  );
}