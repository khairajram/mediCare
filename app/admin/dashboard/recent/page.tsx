"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaHistory, FaTruck, FaCalendarAlt, FaExclamationTriangle, FaUserPlus, FaSync } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface Log {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  createdAt: string;
}

export default function AdminRecentActivityPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/activity");
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getLogIcon = (action: string) => {
    switch (action) {
      case "ORDER_CREATED":
      case "ORDER_STATUS_UPDATED":
        return <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"><FaTruck /></div>;
      case "APPOINTMENT_BOOKED":
      case "APPOINTMENT_STATUS_UPDATED":
        return <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"><FaCalendarAlt /></div>;
      case "LOW_STOCK_ALERT":
        return <div className="p-2 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400"><FaExclamationTriangle /></div>;
      default:
        return <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500"><FaHistory /></div>;
    }
  };

  return (
    <div className="p-6 max-w-5xl pl-0 md:pl-16 mx-auto min-h-screen dark:text-white text-gray-800 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Audit Log</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track operations, booking changes, low stock events, and user orders.</p>
        </div>
        <Button variant="outline" onClick={fetchLogs} className="flex items-center gap-2">
          <FaSync className={`${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Fetching recent activity logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <Card className="glass-panel text-center py-16">
          <div className="text-4xl mb-3">🕒</div>
          <CardTitle className="text-lg">No Activity Logged</CardTitle>
          <p className="text-gray-500 text-sm mt-1">Actions performed on the platform will be listed here.</p>
        </Card>
      ) : (
        <Card className="border dark:border-gray-800 shadow-sm glass-card overflow-hidden">
          <CardContent className="p-6">
            <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 space-y-8 py-2">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-8">
                  {/* Positioned Icon */}
                  <div className="absolute -left-5 top-0 bg-white dark:bg-[#1E1E1E] rounded-full p-0.5 border dark:border-gray-800">
                    {getLogIcon(log.action)}
                  </div>
                  
                  {/* Log Content */}
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-sm font-bold tracking-tight text-gray-800 dark:text-white">
                        {log.action.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {log.details}
                    </p>

                    <div className="text-xs text-gray-400 font-medium">
                      Performed by: <span className="text-blue-600 dark:text-blue-400 font-semibold">{log.performedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}