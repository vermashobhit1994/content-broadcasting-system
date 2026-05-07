import React from 'react'
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

export default function PublishContentButton({isUploading,file}) {
  return (
   <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-12" disabled={isUploading || !file}>
                      {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" 
                      /> Uploading...</> : "Publish Content"}
                    </Button>
  )
}
