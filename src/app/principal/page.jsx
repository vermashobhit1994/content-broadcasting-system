// src/app/principal/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { LogOut, Users, FileCheck, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PrincipalPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(); // Calls supabase.auth.signOut() via Context
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex justify-between items-center p-6 bg-white border-b shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Principal Panel</h1>
          <p className="text-sm text-slate-500">Authenticated: {user?.email}</p>
        </div>

        <Button 
          variant="ghost" 
          className="text-slate-600 hover:text-red-600 hover:bg-red-50 gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span className="font-medium">Sign Out</span>
        </Button>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard icon={<Users />} label="Manage Teachers" color="text-indigo-600" />
          <DashboardCard icon={<FileCheck />} label="Review Content" color="text-green-600" />
          <DashboardCard icon={<Settings />} label="Settings" color="text-slate-600" />
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ icon, label, color }) {
  return (
    <div className="p-6 bg-white rounded-xl border shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition-shadow cursor-pointer">
      <div className={color}>{icon}</div>
      <h3 className="font-semibold">{label}</h3>
    </div>
  );
}