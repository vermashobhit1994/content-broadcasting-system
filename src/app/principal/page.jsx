"use client";

import { useEffect, useState } from "react";
import { LogOut, Users, FileCheck, Settings, Eye, CheckCircle, XCircle, ChevronLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function PrincipalPage() {
  const { user, logout } = useAuth();
  const [view, setView] = useState("dashboard"); // "dashboard" or "review"
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Submissions
  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error("Error loading content");
    else setSubmissions(data || []);
    setLoading(false);
  };

  // 2. Real-time Subscription
  useEffect(() => {
    if (view === "review") {
      fetchSubmissions();
      const channel = supabase
        .channel("principal_updates")
        .on("postgres_changes", { event: "*", schema: "public", table: "submissions" }, fetchSubmissions)
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [view]);

  // 3. Update Status (Approve/Reject)
  const handleReview = async (id, newStatus) => {
    const { error } = await supabase
      .from("submissions")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) toast.error("Failed to update status");
    else toast.success(`Content ${newStatus}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex justify-between items-center p-6 bg-white border-b shadow-sm">
        <div className="flex items-center gap-4">
          {view === "review" && (
            <Button variant="ghost" size="icon" onClick={() => setView("dashboard")}>
              <ChevronLeft />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {view === "dashboard" ? "Principal Panel" : "Review Queue"}
            </h1>
            <p className="text-sm text-slate-500">User: {user?.email}</p>
          </div>
        </div>

        <Button variant="ghost" className="text-slate-600 hover:text-red-600 hover:bg-red-50 gap-2" onClick={handleLogout}>
          <LogOut size={18} />
          <span className="font-medium">Sign Out</span>
        </Button>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {view === "dashboard" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard icon={<Users />} label="Manage Teachers" color="text-indigo-600" />
            <div onClick={() => setView("review")}>
              <DashboardCard icon={<FileCheck />} label="Review Content" color="text-green-600" />
            </div>
            <DashboardCard icon={<Settings />} label="Settings" color="text-slate-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
            ) : submissions.length === 0 ? (
              <p className="text-center text-slate-500 py-10">No content submitted for review.</p>
            ) : (
              submissions.map((sub) => (
                <Card key={sub.id} className="border-l-4 border-l-indigo-500">
                  <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{sub.title}</h3>
                        <Badge variant={sub.status === 'pending' ? 'outline' : 'default'}>{sub.status}</Badge>
                      </div>
                      <p className="text-sm text-slate-600">{sub.description}</p>
                      <p className="text-xs text-slate-400 mt-1">From: {sub.teacher_email} • Duration: {sub.duration}s</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={sub.file_url} target="_blank" rel="noreferrer"><Eye className="mr-2" size={16}/>Preview</a>
                      </Button>
                      {sub.status === "pending" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleReview(sub.id, "approved")}>
                            <CheckCircle className="mr-2" size={16}/>Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReview(sub.id, "rejected")}>
                            <XCircle className="mr-2" size={16}/>Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
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