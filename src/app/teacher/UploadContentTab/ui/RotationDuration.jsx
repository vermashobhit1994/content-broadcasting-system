import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Controller } from "react-hook-form";

export default function RotationDuration({field,control}) {
  
    if(!field && !control)
        return;
    return (

    <div className="space-y-2">
  <Label>Rotation Duration</Label>
  <Controller
    name="duration"
    control={control}
    defaultValue="10"
    render={({ field }) => (
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <SelectTrigger>
          <SelectValue placeholder="Select duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 Seconds (Fast)</SelectItem>
          <SelectItem value="10">10 Seconds (Standard)</SelectItem>
          <SelectItem value="15">15 Seconds (Detailed)</SelectItem>
          <SelectItem value="30">30 Seconds (Long)</SelectItem>
        </SelectContent>
      </Select>
    )}
  />
</div>
  )
}
