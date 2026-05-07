import React from 'react'
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
export default function LogoutButton({handleLogout}) {
  return (
    <Button 
          variant="outline" 
          className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-100 gap-2 px-4"
          onClick={handleLogout} // Trigger logout functionality
        >
          <LogOut size={18} />
          <span className="font-semibold">Logout</span>
        </Button>
  )
}
