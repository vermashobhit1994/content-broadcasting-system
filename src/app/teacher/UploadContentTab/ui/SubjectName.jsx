import React from 'react'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SubjectName({register}) {
  return (
   <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input {...register("subject")} placeholder="e.g. Mathematics" />
                    </div>
  )
}
