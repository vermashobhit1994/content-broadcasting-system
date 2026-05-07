import React from "react";

export default function DashboardHeaderTitle({user}) {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Teacher Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
                Signed in as: <span className="font-medium">{user?.email}</span>
            </p>
        </div>
    );
}
