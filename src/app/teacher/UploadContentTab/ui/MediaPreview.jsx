import React from 'react'
import { FileIcon,Upload,Trash2,EyeOff,Eye } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PublishContentButton from './PublishContentButton';
import { useState,useRef } from 'react';
import { toast } from "sonner";

export default function MediaPreview({
  isUploading,
  setIsUploading,
  file,
  setFile,
  clearFile,
  handleSubmit,
  preview,
  setPreview,
  fileInputRef
}) {
// const [file, setFile] = useState(null);

  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  // const fileInputRef = useRef(null);
  // const [isUploading, setIsUploading] = useState(false);


    // 1. Handle File Processing (Shared by click and drag)
  const processFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
      setShowPdfPreview(true); // Auto-show preview on select
    }
  };

   // 2. Function to trigger the hidden input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Upload JPG, PNG, GIF, or PDF only.");
      return;
    }
    // convert bytes to MB
    const fileSize = selectedFile.size / 1024 / 1024;
    if(fileSize > 10){
        toast.error("File size exceed")
        return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    if (selectedFile.type === "application/pdf") setShowPdfPreview(false);
    processFile(selectedFile);
  };


//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     processFile(selectedFile);
//   };

  // 2. Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  


  return (
    <div className="space-y-4">
                    <Label>Media Preview</Label>
                    
                    {!file ? (
                      <div onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={triggerFileInput} 
                      className="border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer relative">
                        <Input ref={fileInputRef} onChange={handleFileChange} type="file" id="file-upload" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" />
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
                    <PublishContentButton isUploading={isUploading} file={file} />
                  </div>
  )
}
