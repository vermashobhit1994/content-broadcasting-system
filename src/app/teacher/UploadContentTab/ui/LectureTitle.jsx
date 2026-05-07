import React from 'react'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export default function LectureTitle({register,errors}) {
  return (
    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input {...register("title", { required: "Title is required" })} placeholder="Lecture Title" />
                      {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                    </div>
  )
}
