import React from 'react'
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function SubjectDescription({register}) {
  return (
  <div className="space-y-2">
  <Label htmlFor="description">Broadcast Description</Label>
  <Textarea 
    id="description"
    placeholder="Explain what this content is for..."
    {...register("description", { maxLength: 200 })}
    className="min-h-100px resize-none"
  />
  <p className="text-[10px] text-right text-slate-400">
    {/* {watch("description")?.length || 0}/200 characters */}
  </p>
</div>)
}
