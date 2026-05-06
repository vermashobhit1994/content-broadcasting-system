"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  startTime: z.string(),
  endTime: z.string(),
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
  message: "End time must be after start time",
  path: ["endTime"],
});

export default function UploadForm() {
  const [preview, setPreview] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10485760) { // 10MB check
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    // Call ContentService.uploadContent here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <label>Title</label>
        <Input {...register("title")} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      
      <div>
        <label>File Upload (JPG/PNG/GIF - Max 10MB)</label>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
      </div>

      <div className="flex gap-4">
        <Input type="datetime-local" {...register("startTime")} />
        <Input type="datetime-local" {...register("endTime")} />
      </div>

      <Button type="submit">Upload Content</Button>
    </form>
  );
}