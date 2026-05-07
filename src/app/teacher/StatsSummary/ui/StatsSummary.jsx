import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Clock,XCircle,CheckCircle } from 'lucide-react';

export default function StatsSummary({stats}) {
    function StatCard({ title, value, icon, color = "" }) {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
        <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-tight">{title}</CardTitle>
        <div className="text-slate-300">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} icon={<FileText size={18}/>} />
        <StatCard title="Pending" value={stats.pending} icon={<Clock size={18}/>} color="text-yellow-600" />
        <StatCard title="Approved" value={stats.approved} icon={<CheckCircle size={18}/>} color="text-green-600" />
        <StatCard title="Rejected" value={stats.rejected} icon={<XCircle size={18}/>} color="text-red-600" />
      </div>
  )
}
