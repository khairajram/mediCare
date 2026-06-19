"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaCalendarPlus, FaCalendarAlt, FaStethoscope, FaCut, FaArrowLeft, FaTimesCircle } from "react-icons/fa";
import Link from "next/link";

interface Pet {
  id: string;
  name: string;
  species: string;
}

interface Appointment {
  id: string;
  type: "VET_DOCTOR" | "GROOMING_BATHING" | "GROOMING_HAIRCUT" | "GROOMING_FULL";
  date: string;
  status: string;
  notes?: string | null;
  createdAt: string;
  pet: {
    name: string;
    species: string;
  };
}

export default function UserAppointmentsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [petId, setPetId] = useState("");
  const [type, setType] = useState("VET_DOCTOR");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch user profile to get pets list
      const profileRes = await fetch("/api/me");
      const profileData = await profileRes.json();
      if (profileRes.ok && profileData.user?.id) {
        const petRes = await fetch(`/api/pet?userId=${profileData.user.id}`);
        const petData = await petRes.json();
        if (petRes.ok) {
          setPets(petData.pets || []);
          if (petData.pets && petData.pets.length > 0) {
            setPetId(petData.pets[0].id);
          }
        }
      }

      // Fetch user appointments
      const appRes = await fetch("/api/appointments");
      const appData = await appRes.json();
      if (appRes.ok) {
        setAppointments(appData.appointments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId) return alert("Please select a pet.");
    if (!date || !time) return alert("Please choose a date and time.");

    try {
      setSubmitting(true);
      const combinedDateTime = new Date(`${date}T${time}`).toISOString();
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId,
          type,
          date: combinedDateTime,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Appointment booked successfully! Admin will review it shortly.");
        setDate("");
        setTime("");
        setNotes("");
        fetchData(); // refresh schedule
      } else {
        alert(data.message || "Failed to book appointment");
      }
    } catch (err) {
      console.error(err);
      alert("Error booking appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (appId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      setActionLoading(appId);
      const res = await fetch(`/api/appointments/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: "CANCELLED" } : app))
        );
        alert("Appointment cancelled successfully!");
      } else {
        alert(data.message || "Failed to cancel appointment");
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling appointment");
    } finally {
      setActionLoading(null);
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "VET_DOCTOR":
        return "Doctor Consultation";
      case "GROOMING_BATHING":
        return "Pet Bathing Service";
      case "GROOMING_HAIRCUT":
        return "Pet Haircut Service";
      case "GROOMING_FULL":
        return "Full Grooming Package";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending Review</Badge>;
      case "APPROVED":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Rejected</Badge>;
      case "COMPLETED":
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto dark:text-white text-gray-800 min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Bookings & Grooming</h1>
          <p className="text-sm text-gray-500">Schedule checkups and grooming treatments for your pets.</p>
        </div>
        <Link href="/home">
          <Button variant="outline" className="flex items-center gap-2">
            <FaArrowLeft /> Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Booking Form Card */}
        <div className="lg:col-span-1">
          <Card className="border dark:border-gray-800 shadow-sm glass-card">
            <CardHeader className="border-b dark:border-gray-800 py-4 px-5">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FaCalendarPlus className="text-purple-500" /> Book a Service
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {loading ? (
                <div className="text-center py-10">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-500 text-xs mt-2">Checking profiles...</p>
                </div>
              ) : pets.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">
                  ⚠️ No pets found. You need a pet profile registered to book appointments.
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Select Pet</label>
                    <select
                      value={petId}
                      onChange={(e) => setPetId(e.target.value)}
                      className="w-full p-2.5 glass-input rounded-lg text-xs focus:outline-none text-gray-900 dark:text-white"
                    >
                      {pets.map((pet) => (
                        <option key={pet.id} value={pet.id} className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
                          {pet.name} ({pet.species})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Service Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full p-2.5 glass-input rounded-lg text-xs focus:outline-none text-gray-900 dark:text-white"
                    >
                      <option value="VET_DOCTOR" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">🩺 Doctor Consultation</option>
                      <option value="GROOMING_BATHING" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">🛁 Pet Bathing Service</option>
                      <option value="GROOMING_HAIRCUT" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">✂️ Pet Haircut Service</option>
                      <option value="GROOMING_FULL" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">🧼 Full Grooming Package</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Select Date</label>
                      <input
                        type="date"
                        required
                        value={date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2.5 glass-input rounded-lg text-xs focus:outline-none text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Select Time</label>
                      <input
                        type="time"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full p-2.5 glass-input rounded-lg text-xs focus:outline-none text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Notes / Concerns (Optional)</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. skin allergies, vaccine checkup, aggressive pet handling"
                      className="w-full p-2.5 glass-input rounded-lg text-xs focus:outline-none text-gray-900 dark:text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 text-xs tracking-wide uppercase"
                  >
                    {submitting ? "Booking..." : "Submit Booking Request"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Appointments List Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FaCalendarAlt className="text-purple-500" /> Bookings Schedule
          </h2>

          {loading ? (
            <div className="text-center py-10">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : appointments.length === 0 ? (
            <Card className="p-10 text-center text-gray-400 text-sm">
              You do not have any appointments booked.
            </Card>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {appointments.map((app) => (
                <Card key={app.id} className="border dark:border-gray-800 shadow-sm glass-card">
                  <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {app.type === "VET_DOCTOR" ? (
                          <FaStethoscope className="text-blue-500 text-sm" />
                        ) : (
                          <FaCut className="text-purple-500 text-sm" />
                        )}
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {getTypeName(app.type)}
                        </span>
                        {getStatusBadge(app.status)}
                      </div>

                      <div className="text-xs text-gray-500">
                        For <span className="font-semibold text-gray-800 dark:text-gray-200">🐾 {app.pet.name}</span> ({app.pet.species})
                      </div>

                      <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                        🗓️ {new Date(app.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        at{" "}
                        {new Date(app.date).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      {app.notes && (
                        <p className="text-xs italic text-gray-400 max-w-sm truncate" title={app.notes}>
                          &quot;{app.notes}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0 self-end sm:self-center">
                      {(app.status === "PENDING" || app.status === "APPROVED") && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoading === app.id}
                          onClick={() => handleCancel(app.id)}
                          className="flex items-center gap-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-100 dark:border-red-900/30 text-xs"
                        >
                          <FaTimesCircle /> Cancel
                        </Button>
                      )}
                    </div>
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
