import React from "react";
import DashboardHeaderTitle from "./DashboardHeaderTitle";
import LogoutButton from "./LogoutButton";

export default function DashboardHeader({handleLogout,user}) {
    return (
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
            <DashboardHeaderTitle user={user}/>
            <LogoutButton handleLogout={handleLogout} />
        </header>
    );
}
