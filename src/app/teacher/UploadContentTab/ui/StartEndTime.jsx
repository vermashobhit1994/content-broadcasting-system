import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function StartEndTime({register}) {
    return (
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
    );
}
