"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaEnvelopeOpenText, FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  adminResponse?: string | null;
  createdAt: string;
}

export default function UserSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return alert("Please fill out both subject and message.");

    try {
      setSubmitting(true);
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Support ticket raised successfully! Our team will reply shortly.");
        setSubject("");
        setMessage("");
        fetchTickets(); // refresh list
      } else {
        alert(data.message || "Failed to submit ticket");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting ticket");
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
    <div className="p-4 sm:p-6 max-w-5xl mx-auto dark:text-white text-gray-800 min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Help & Support</h1>
          <p className="text-sm text-gray-500">Submit tickets or ask questions about our pet services.</p>
        </div>
        <Link href="/home">
          <Button variant="outline" className="flex items-center gap-2">
            <FaArrowLeft /> Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Raise Ticket Form */}
        <div className="md:col-span-1">
          <Card className="border dark:border-gray-800 shadow-sm glass-card">
            <CardHeader className="border-b dark:border-gray-800 py-4 px-5">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FaEnvelopeOpenText className="text-green-500" /> Raise a Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Subject / Issue</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Appointment rescheduling help"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-lg text-xs focus:outline-none text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Describe your query</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2.5 glass-input rounded-lg text-xs focus:outline-none text-gray-900 dark:text-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 text-xs tracking-wide uppercase flex items-center justify-center gap-2"
                >
                  <FaPaperPlane /> {submitting ? "Submitting..." : "Send Ticket"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Tickets History List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold">Your Support Tickets</h2>

          {loading ? (
            <div className="text-center py-10">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : tickets.length === 0 ? (
            <Card className="p-10 text-center text-gray-400 text-sm">
              You haven&apos;t raised any support tickets yet.
            </Card>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {tickets.map((t) => (
                <Card key={t.id} className="border dark:border-gray-800 shadow-sm glass-card">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                          {t.subject}
                        </h3>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          Submitted on {new Date(t.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {getStatusBadge(t.status)}
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-lg border dark:border-gray-900/30">
                      {t.message}
                    </p>

                    {t.adminResponse ? (
                      <div className="bg-blue-50/50 dark:bg-blue-950/15 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 text-xs">
                        <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
                          Admin Response:
                        </span>
                        <p className="italic text-gray-700 dark:text-gray-300 leading-relaxed">
                          &quot;{t.adminResponse}&quot;
                        </p>
                      </div>
                    ) : (
                      <div className="text-[10px] text-gray-400 italic">
                        No admin response yet. We usually reply within a few hours.
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
