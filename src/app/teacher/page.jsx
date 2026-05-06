"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Added for redirection
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Loader2, 
  Trash2,
  Eye,
  EyeOff,
  FileIcon,
  LogOut 
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { ContentService } from "@/services/content.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "Format: HH:mm:ss"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "Format: HH:mm:ss"),
}).refine((data) => data.endTime > data.startTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export default function TeacherPage() {
  const { user, logout } = useAuth();
  const router = useRouter(); // Initialize router
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: { startTime: "09:00:00", endTime: "10:00:00" }
  });

  // Dedicated Logout Handler
  const handleLogout = async () => {
    try {
      await logout(); // Execute auth logic
      toast.success("Logged out successfully");
      router.push("/"); // Redirect to homepage
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await ContentService.getTeacherContent();
        const summary = data.reduce((acc, item) => {
          acc.total++;
          acc[item.status.toLowerCase()]++;
          return acc;
        }, { total: 0, pending: 0, approved: 0, rejected: 0 });
        setStats(summary);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Upload JPG, PNG, GIF, or PDF only.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    if (selectedFile.type === "application/pdf") setShowPdfPreview(false);
  };

  const clearFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setShowPdfPreview(false);
  };

  const onSubmit = async (data) => {
    if (!file) return toast.error("File is required.");
    setIsUploading(true);
    try {
      await ContentService.uploadContent({ ...data, file });
      toast.success("Submitted successfully!");
      reset();
      clearFile();
    } catch (error) {
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Dashboard Header with Logout */}
      <header className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Teacher Dashboard</h1>
          <p className="text-sm text-muted-foreground">Signed in as: <span className="font-medium">{user?.email}</span></p>
        </div>
        <Button 
          variant="outline" 
          className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-100 gap-2 px-4"
          onClick={handleLogout} // Trigger logout functionality
        >
          <LogOut size={18} />
          <span className="font-semibold">Logout</span>
        </Button>
      </header>

      {/* Stats Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} icon={<FileText size={18}/>} />
        <StatCard title="Pending" value={stats.pending} icon={<Clock size={18}/>} color="text-yellow-600" />
        <StatCard title="Approved" value={stats.approved} icon={<CheckCircle size={18}/>} color="text-green-600" />
        <StatCard title="Rejected" value={stats.rejected} icon={<XCircle size={18}/>} color="text-red-600" />
      </div>

      <Tabs defaultValue="upload">
        <TabsList className="mb-4">
          <TabsTrigger value="upload">Upload Content</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Broadcast Details</CardTitle>
              <CardDescription>Enter metadata and select your file (PDF or Image)</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Form Inputs */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input {...register("title")} placeholder="Lecture Title" />
                      {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input {...register("subject")} placeholder="e.g. Mathematics" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start (HH:mm:ss)</Label>
                        <Input type="time" step="1" {...register("startTime")} />
                      </div>
                      <div className="space-y-2">
                        <Label>End (HH:mm:ss)</Label>
                        <Input type="time" step="1" {...register("endTime")} />
                      </div>
                    </div>
                  </div>

                  {/* File Upload, Preview, and Removal Controls */}
                  <div className="space-y-4">
                    <Label>Media Preview</Label>
                    
                    {!file ? (
                      <div className="border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer relative">
                        <Input type="file" id="file-upload" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" onChange={handleFileChange} />
                        <Upload className="h-8 w-8 text-indigo-600 mb-2" />
                        <span className="font-semibold text-slate-700 text-center">Click to select or drag and drop</span>
                        <span className="text-xs text-slate-500">PDF, JPG, or PNG (Max 10MB)</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Top Action Bar for PDF Controls */}
                        <div className="flex items-center justify-between p-2 bg-slate-100 rounded-lg border">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 truncate max-w-[150px]">
                            <FileIcon size={14} /> {file.name}
                          </div>
                          <div className="flex gap-2">
                            {file.type === "application/pdf" && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="h-8 gap-2 bg-white"
                                onClick={() => setShowPdfPreview(!showPdfPreview)} // Preview PDF button
                              >
                                {showPdfPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                                {showPdfPreview ? "Hide" : "Preview"}
                              </Button>
                            )}
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm" 
                              className="h-8 px-2"
                              onClick={clearFile} // Dedicated delete button
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="rounded-lg overflow-hidden border bg-white shadow-inner">
                          {file.type === "application/pdf" ? (
                            showPdfPreview && (
                              <iframe src={preview} className="w-full h-[400px]" title="PDF Viewer" />
                            )
                          ) : (
                            <img src={preview} alt="Preview" className="w-full h-auto max-h-[400px] object-contain p-2 mx-auto" />
                          )}
                        </div>
                      </div>
                    )}
                    
                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-12" disabled={isUploading || !file}>
                      {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Publish Content"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, icon, color = "" }) {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-tight">{title}</CardTitle>
        <div className="text-slate-300">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
      </CardContent>
    </Card>
  );
}