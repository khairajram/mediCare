"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaCalendarAlt, FaStethoscope, FaCut, FaCheck, FaTimes, FaSync } from "react-icons/fa";

interface Appointment {
  id: string;
  type: "VET_DOCTOR" | "GROOMING_BATHING" | "GROOMING_HAIRCUT" | "GROOMING_FULL";
  date: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  notes?: string | null;
  createdAt: string;
  user: {
    name: string;
    phoneNo: string;
    email: string | null;
  };
  pet: {
    name: string;
    species: string;
    breed: string | null;
  };
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (res.ok) {
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: status as any } : app))
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating appointment");
    } finally {
      setUpdatingId(null);
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "VET_DOCTOR":
        return "Doctor Consultation";
      case "GROOMING_BATHING":
        return "Pet Bathing";
      case "GROOMING_HAIRCUT":
        return "Pet Haircut";
      case "GROOMING_FULL":
        return "Full Grooming Package";
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === "VET_DOCTOR") {
      return <FaStethoscope className="text-blue-500 text-lg" />;
    }
    return <FaCut className="text-purple-500 text-lg" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</Badge>;
      case "APPROVED":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Rejected</Badge>;
      case "COMPLETED":
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesStatus = filterStatus === "ALL" || app.status === filterStatus;
    const matchesType =
      filterType === "ALL" ||
      (filterType === "VET" && app.type === "VET_DOCTOR") ||
      (filterType === "GROOMING" && app.type.startsWith("GROOMING"));
    return matchesStatus && matchesType;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen dark:text-white text-gray-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">
            Appointments Bookings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage pet grooming reservations and veterinary doctor schedules.
          </p>
        </div>

        <Button variant="outline" onClick={fetchAppointments} className="flex items-center gap-2">
          <FaSync className={`${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border dark:border-gray-800 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded-lg bg-transparent dark:border-gray-800 text-sm focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Category</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border rounded-lg bg-transparent dark:border-gray-800 text-sm focus:outline-none"
            >
              <option value="ALL">All Services</option>
              <option value="VET">Doctor Consultations</option>
              <option value="GROOMING">Grooming Services</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Showing <span className="font-bold">{filteredAppointments.length}</span> entries
        </div>
      </div>

      {/* Table inside card */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Retrieving bookings schedule...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Card className="glass-panel text-center py-16">
          <div className="text-4xl mb-3">📅</div>
          <CardTitle className="text-lg font-bold">No Appointments Found</CardTitle>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            No active reservations match your filters.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden border dark:border-gray-800 shadow-sm glass-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Pet details</TableHead>
                  <TableHead>Service / Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="font-semibold">{app.user.name}</div>
                      <div className="text-xs text-gray-500">{app.user.phoneNo}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold flex items-center gap-1">
                        <span>🐾</span> {app.pet.name}
                      </div>
                      <div className="text-xs text-gray-500">{app.pet.species} {app.pet.breed ? `• ${app.pet.breed}` : ""}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(app.type)}
                        <span className="font-medium text-sm">{getTypeName(app.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-sm">
                        {new Date(app.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(app.date).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>
                      <p className="text-xs italic text-gray-500 max-w-[150px] truncate" title={app.notes || ""}>
                        {app.notes || "—"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {app.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-green-600 hover:bg-green-700 text-white p-2 h-8"
                              disabled={updatingId === app.id}
                              onClick={() => updateStatus(app.id, "APPROVED")}
                              title="Approve Booking"
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="bg-red-600 hover:bg-red-700 text-white p-2 h-8"
                              disabled={updatingId === app.id}
                              onClick={() => updateStatus(app.id, "REJECTED")}
                              title="Reject Booking"
                            >
                              <FaTimes />
                            </Button>
                          </>
                        )}

                        {app.status === "APPROVED" && (
                          <>
                            <Button
                              size="sm"
                              disabled={updatingId === app.id}
                              onClick={() => updateStatus(app.id, "COMPLETED")}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-2.5"
                            >
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updatingId === app.id}
                              onClick={() => updateStatus(app.id, "CANCELLED")}
                              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs h-8 px-2.5 border-red-200 dark:border-red-900/30"
                            >
                              Cancel
                            </Button>
                          </>
                        )}

                        {app.status === "COMPLETED" && (
                          <span className="text-xs text-green-600 dark:text-green-400 font-semibold py-1">
                            Completed ✓
                          </span>
                        )}

                        {app.status === "REJECTED" && (
                          <span className="text-xs text-red-500 font-semibold py-1">
                            Rejected ✗
                          </span>
                        )}

                        {app.status === "CANCELLED" && (
                          <span className="text-xs text-gray-400 font-semibold py-1">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
