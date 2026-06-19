"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaReply, FaCheckCircle, FaExclamationCircle, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  adminResponse?: string | null;
  createdAt: string;
  user: {
    name: string;
    phoneNo: string;
    email: string | null;
  };
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [responseMsg, setResponseMsg] = useState("");
  const [newStatus, setNewStatus] = useState<string>("RESOLVED");
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/support");
      const data = await res.json();
      if (res.ok) {
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/support/${selectedTicket.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminResponse: responseMsg,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTickets((prev) =>
          prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: newStatus as any, adminResponse: responseMsg } : t))
        );
        setSelectedTicket(null);
        setResponseMsg("");
        alert("Response submitted successfully!");
      } else {
        alert(data.message || "Failed to submit response");
      }
    } catch (err) {
      console.error(err);
      alert("Error responding to ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Open</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">In Progress</Badge>;
      case "RESOLVED":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Resolved</Badge>;
      case "CLOSED":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto dark:text-white text-gray-800 min-h-screen bg-white dark:bg-[#1E1E1E] min-w-full space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Customer Support Tickets</h1>
          <p className="text-sm text-gray-500">Read and respond to support queries raised by clients.</p>
        </div>
        <Link href="/admin/dashboard/customers">
          <Button variant="outline" className="flex items-center gap-2">
            <FaArrowLeft /> Back
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm mt-3">Loading support tickets...</p>
        </div>
      ) : selectedTicket ? (
        /* Respond Panel */
        <Card className="glass-panel max-w-2xl mx-auto border dark:border-gray-800">
          <CardHeader className="border-b dark:border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Respond to: &quot;{selectedTicket.subject}&quot;</CardTitle>
                <div className="text-xs text-gray-500 mt-1">
                  From: {selectedTicket.user.name} ({selectedTicket.user.phoneNo})
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedTicket(null)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border dark:border-gray-800">
              <span className="text-xs font-semibold text-gray-400 block mb-1 uppercase tracking-wider">User Message</span>
              <p className="text-sm leading-relaxed">{selectedTicket.message}</p>
              <span className="text-[10px] text-gray-400 block mt-2">
                Raised at {new Date(selectedTicket.createdAt).toLocaleString()}
              </span>
            </div>

            <form onSubmit={handleResponseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Admin Response</label>
                <textarea
                  required
                  rows={4}
                  value={responseMsg}
                  onChange={(e) => setResponseMsg(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full p-3 border dark:border-gray-800 rounded-xl bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Update Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="p-2 border dark:border-gray-800 rounded-lg bg-transparent text-sm focus:outline-none"
                  >
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved (Recommend)</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  {submitting ? "Sending..." : "Submit Response"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : tickets.length === 0 ? (
        <Card className="text-center py-16 glass-panel">
          <div className="text-4xl mb-3">💬</div>
          <CardTitle className="text-lg">No Tickets Found</CardTitle>
          <p className="text-gray-500 text-sm mt-1">Excellent! There are no outstanding customer support queries.</p>
        </Card>
      ) : (
        /* Tickets Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((t) => (
            <Card key={t.id} className="overflow-hidden border dark:border-gray-800 glass-card">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-base leading-tight truncate" title={t.subject}>
                      {t.subject}
                    </h3>
                    {getStatusBadge(t.status)}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    By <span className="font-semibold">{t.user.name}</span> ({t.user.phoneNo}) • {new Date(t.createdAt).toLocaleDateString()}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {t.message}
                  </p>
                </div>

                {t.adminResponse && (
                  <div className="bg-blue-50/50 dark:bg-blue-950/15 p-3 rounded-lg border dark:border-blue-950/20 text-xs mt-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">Response:</span>
                    <p className="italic text-gray-600 dark:text-gray-300 line-clamp-2">{t.adminResponse}</p>
                  </div>
                )}

                <div className="pt-3 border-t dark:border-gray-800 flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedTicket(t);
                      setResponseMsg(t.adminResponse || "");
                      setNewStatus(t.status === "OPEN" ? "RESOLVED" : t.status);
                    }}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white"
                  >
                    <FaReply /> {t.adminResponse ? "Edit Reply" : "Respond"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}