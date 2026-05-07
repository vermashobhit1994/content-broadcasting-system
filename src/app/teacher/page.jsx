"use client";

import DashboardHeader from "./DashboardHeader/ui/DashboardHeader";
import StatsSummary from "./StatsSummary/ui/StatsSummary";
import LectureTitle from "./UploadContentTab/ui/LectureTitle";
import SubjectName from "./UploadContentTab/ui/SubjectName";
import StartEndTime from "./UploadContentTab/ui/StartEndTime";
import PublishContentButton from "./UploadContentTab/ui/PublishContentButton";
import MediaPreview from "./UploadContentTab/ui/MediaPreview"
import SubjectDescription from "./UploadContentTab/ui/SubjectDescription"
import RotationDuration from "./UploadContentTab/ui/RotationDuration"

import { supabase } from "@/lib/supabase";

import { useState, useEffect,useRef } from "react";
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



export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter(); // Initialize router
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [isUploading, setIsUploading] = useState(false);



  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);


  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: { startTime: "09:00:00", endTime: "10:00:00" },
    mode: "onSubmit"
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

  const clearFile = () => {
    setFile(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 2. Define the reset logic
const handleFormReset = () => {
  // Reset react-hook-form fields (title, description, etc.)
  reset(); 

  // Reset local state
  setFile(null);
  setPreview(""); 
  if (typeof setShowPdfPreview === "function") {
    setShowPdfPreview(false);
  }

  // CRITICAL: Reset the actual HTML input value
  // If you don't do this, you can't re-upload the same file twice in a row
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

  const onSubmit = async (data) => {
  if (!file) return toast.error("Please select a file first.");
  
  setIsUploading(true);
  try {
    // 1. Generate a Clean, Unique File Name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`; // Organized by user folder

    // 2. Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("broadcasts") // Ensure this bucket exists and is public
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (storageError) {
      console.error("Storage Error Detail:", storageError);
      throw new Error(`Storage Upload Failed: ${storageError.message}`);
    }

    // 3. Get the Public URL
    const { data: { publicUrl } } = supabase.storage
      .from("broadcasts")
      .getPublicUrl(filePath);

    // 4. Insert Metadata into Database
    // Note: We combine form 'data' (title, duration) with 'publicUrl'
    const { error: dbError } = await supabase
      .from("submissions")
      .insert([
        {
          title: data.title,
          description: data.description,
          duration: parseInt(data.duration), // Ensure it's a number
          file_url: publicUrl,
          file_name: file.name,
          teacher_email: user.email,
          status: "pending",
        },
      ]);

    if (dbError) {
      console.error("Database Error Detail:", dbError);
      throw new Error(`Database Record Creation Failed: ${dbError.message}`);
    }

    // 5. Success UI Update
    toast.success("Content submitted for review!");
    setTimeout(() => {
      handleFormReset();
    }, 100);
    handleFormReset(); // Clears form and file states
    
  } catch (error) {
    console.error("Submission Catch Block:", error);
    toast.error(error.message || "An unexpected error occurred.");
  } finally {
    setIsUploading(false);
  }
};

  
//     const onSubmitForm = async (data) => {
//       console.log("hello")
//         if (!file) return toast.error("File is required.");
//         setIsUploading(true);
//         // 1. Generate a Clean, Unique File Name
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
//     const filePath = `${user.id}/${fileName}`; // Organized by user folder

//     // 2. Upload to Supabase Storage
//     const { data: storageData, error: storageError } = await supabase.storage
//       .from("broadcasts") // Ensure this bucket exists and is public
//       .upload(filePath, file, {
//         cacheControl: '3600',
//         upsert: false
//       });
//       if (storageError) {
//       console.error("Storage Error Detail:", storageError);
//       throw new Error(`Storage Upload Failed: ${storageError.message}`);
//     }
//     // 3. Get the Public URL
//     const { data: { publicUrl } } = supabase.storage
//       .from("broadcasts")
//       .getPublicUrl(filePath);

    
//       // 4. Insert Metadata into Database
//     // Note: We combine form 'data' (title, duration) with 'publicUrl'
//     const { error: dbError } = await supabase
//       .from("submissions")
//       .insert([
//         {
//           title: data.title,
//           description: data.description,
//           duration: parseInt(data.duration), // Ensure it's a number
//           file_url: publicUrl,
//           file_name: file.name,
//           teacher_email: user.email,
//           status: "pending",
//         },
//       ]);

//     if (dbError) {
//       console.error("Database Error Detail:", dbError);
//       throw new Error(`Database Record Creation Failed: ${dbError.message}`);
//     }

//     // 5. Success UI Update
//     toast.success("Content submitted for review!");
//     handleFormReset(); // Clears form and file states

//     } catch (error) {
//     console.error("Submission Catch Block:", error);
//     toast.error(error.message || "An unexpected error occurred.");
//   } finally {
//     setIsUploading(false);
//   }
// }
    
      //   try {
      //     await ContentService.uploadContent({ ...data, file });
      //     toast.success("Submitted successfully!");
      //     reset();
      //     clearFile();
      //   } catch (error) {
      //     toast.error("Upload failed.");
      //   } finally {
      //     setIsUploading(false);
      //   }
      // };
      // console.log("validation errors", errors)

 
  


  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Dashboard Header with Logout */}
      <DashboardHeader handleLogout={handleLogout} user={user} />

      {/* Stats Summary Section */}
      <StatsSummary stats={stats}/>

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
                    <LectureTitle register={register} errors={errors}/>
                    <SubjectName register={register}/>
                    <SubjectDescription register={register}/>
                    <StartEndTime register={register}/>
                    <RotationDuration field={""} control={""}/>
                  </div>

                  {/* File Upload, Preview, and Removal Controls */}
                    <MediaPreview 
                          showPdfPreview={showPdfPreview} 
                          file={file}
                          setFile={setFile}
                          preview={preview}
                          setPreview={setPreview}
                          setShowPdfPreview={setShowPdfPreview}
                          
                          isUploading={isUploading}
                          setIsUploading={setIsUploading}
                          isDragging={isDragging}
                          setIsDragging={setIsDragging}
                          clearFile={clearFile}
                          fileInputRef={fileInputRef}
                          
                    />  
                    
                    
                  
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

