"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaPills, FaExclamationTriangle, FaUsers, FaCalendarCheck, FaTruck, FaArrowRight } from "react-icons/fa";
import { useData } from "@/app/context/adminDataStore";
import Link from "next/link";

interface Order {
  id: string;
  status: string;
}

interface Appointment {
  id: string;
  type: string;
  date: string;
  status: string;
  pet: { name: string };
  user: { name: string };
}

export default function AdminDashboardHome() {
  const { medicines, users } = useData();
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardDetails = async () => {
      try {
        setLoading(true);
        // Fetch orders
        const ordRes = await fetch("/api/orders");
        const ordData = await ordRes.json();
        if (ordRes.ok) setOrders(ordData.orders || []);

        // Fetch appointments
        const appRes = await fetch("/api/appointments");
        const appData = await appRes.json();
        if (appRes.ok) setAppointments(appData.appointments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardDetails();
  }, []);

  const lowStock = medicines.filter((m) => m.quantityInStock < m.minimumStockLevel);
  
  const totalPetsCount = users.reduce((sum, user) => sum + (user._count?.pets || 0), 0);

  // Stats calculation for SVG chart
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const transitOrders = orders.filter((o) => o.status === "PACKING" || o.status === "SHIPPED").length;
  const completedOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;

  const totalOrders = orders.length;

  const upcomingAppts = appointments
    .filter((a) => a.status === "PENDING" || a.status === "APPROVED")
    .slice(0, 3); // show top 3 upcoming

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen dark:text-white text-gray-800 space-y-8 bg-transparent">
      
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            MediCare Admin Hub
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Jodhpur Karni Pet Care Center • Operations Overview & System Metrics.
          </p>
        </div>
        <div className="text-xs text-gray-400 font-semibold bg-white dark:bg-slate-900 border dark:border-gray-800 px-3 py-1.5 rounded-lg shadow-sm">
          System Online • PostgreSQL Running
        </div>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaPills size={22} />}
          label="Total Medicines"
          value={String(medicines.length)}
          iconBg="bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
        />
        <StatCard
          icon={<FaExclamationTriangle size={22} />}
          label="Low Stock Alerts"
          value={String(lowStock.length)}
          iconBg="bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
          highlight={lowStock.length > 0}
        />
        <StatCard
          icon={<FaCalendarCheck size={22} />}
          label="Total Bookings"
          value={String(appointments.length)}
          iconBg="bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
        />
        <StatCard
          icon={<FaUsers size={22} />}
          label="Registered Users"
          value={String(users.length)}
          iconBg="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
        />
      </div>

      {/* Analytics & Schedule Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive SVG Chart for Orders */}
        <Card className="lg:col-span-1 border dark:border-gray-800 shadow-sm glass-card overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-900/60 border-b dark:border-gray-800 py-3.5 px-5">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FaTruck className="text-blue-500" /> Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-6">
            {totalOrders === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs">No orders logged.</div>
            ) : (
              <>
                {/* SVG Bar Chart */}
                <svg width="240" height="150" className="mt-2" viewBox="0 0 240 150">
                  <defs>
                    <linearGradient id="yellow-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id="green-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <linearGradient id="red-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" />
                      <stop offset="100%" stopColor="#b91c1c" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="30" y1="120" x2="230" y2="120" stroke="#cbd5e1" strokeWidth="1.5" className="dark:stroke-slate-800/60" />
                  <line x1="30" y1="20" x2="30" y2="120" stroke="#cbd5e1" strokeWidth="1.5" className="dark:stroke-slate-800/60" />

                  {/* Bars */}
                  {/* Pending (Yellow) */}
                  <rect 
                    x="50" 
                    y={120 - Math.min(100, (pendingOrders / Math.max(1, totalOrders)) * 100)} 
                    width="25" 
                    height={Math.min(100, (pendingOrders / Math.max(1, totalOrders)) * 100)} 
                    fill="url(#yellow-grad)" 
                    rx="4" 
                  />
                  {/* Transit (Blue) */}
                  <rect 
                    x="95" 
                    y={120 - Math.min(100, (transitOrders / Math.max(1, totalOrders)) * 100)} 
                    width="25" 
                    height={Math.min(100, (transitOrders / Math.max(1, totalOrders)) * 100)} 
                    fill="url(#blue-grad)" 
                    rx="4" 
                  />
                  {/* Delivered (Green) */}
                  <rect 
                    x="140" 
                    y={120 - Math.min(100, (completedOrders / Math.max(1, totalOrders)) * 100)} 
                    width="25" 
                    height={Math.min(100, (completedOrders / Math.max(1, totalOrders)) * 100)} 
                    fill="url(#green-grad)" 
                    rx="4" 
                  />
                  {/* Cancelled (Red) */}
                  <rect 
                    x="185" 
                    y={120 - Math.min(100, (cancelledOrders / Math.max(1, totalOrders)) * 100)} 
                    width="25" 
                    height={Math.min(100, (cancelledOrders / Math.max(1, totalOrders)) * 100)} 
                    fill="url(#red-grad)" 
                    rx="4" 
                  />

                  {/* Bar Labels (Count) */}
                  <text x="62.5" y={115 - Math.min(100, (pendingOrders / Math.max(1, totalOrders)) * 100)} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#d97706">{pendingOrders}</text>
                  <text x="107.5" y={115 - Math.min(100, (transitOrders / Math.max(1, totalOrders)) * 100)} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2563eb">{transitOrders}</text>
                  <text x="152.5" y={115 - Math.min(100, (completedOrders / Math.max(1, totalOrders)) * 100)} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">{completedOrders}</text>
                  <text x="197.5" y={115 - Math.min(100, (cancelledOrders / Math.max(1, totalOrders)) * 100)} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#dc2626">{cancelledOrders}</text>

                  {/* Axis Labels */}
                  <text x="62.5" y="135" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="bold">Pend</text>
                  <text x="107.5" y="135" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="bold">Transit</text>
                  <text x="152.5" y="135" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="bold">Deliv</text>
                  <text x="197.5" y="135" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="bold">Canc</text>
                </svg>

                <div className="grid grid-cols-2 gap-4 w-full text-xs border-t dark:border-gray-800/60 pt-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 block"></span>
                    <span className="text-gray-500">Pending Refills</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block"></span>
                    <span className="text-gray-500">Packing & Shipped</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
                    <span className="text-gray-500">Delivered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 block"></span>
                    <span className="text-gray-500">Cancelled</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Medicine Alerts */}
        <Card className="lg:col-span-2 border dark:border-gray-800 shadow-sm glass-card overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-900/60 border-b dark:border-gray-800 py-3.5 px-5 flex flex-row justify-between items-center">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FaExclamationTriangle className="text-red-500 animate-pulse" /> Low Stock Medicines
            </CardTitle>
            <Link href="/admin/dashboard/medicine/instock">
              <Button size="sm" variant="ghost" className="text-xs hover:text-blue-500">
                Manage Stock <FaArrowRight className="ml-1 text-[10px]" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Qty In Stock</TableHead>
                  <TableHead>Min Stock Threshold</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStock.length > 0 ? (
                  lowStock.map((med) => (
                    <TableRow key={med.id} className="bg-red-50/30 dark:bg-red-950/10 hover:bg-red-50/50">
                      <TableCell className="font-semibold">{med.name}</TableCell>
                      <TableCell>{med.type}</TableCell>
                      <TableCell className="text-red-600 dark:text-red-400 font-bold">{med.quantityInStock}</TableCell>
                      <TableCell>{med.minimumStockLevel}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400 py-10 text-xs">
                      ✅ All medicines are well-stocked.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions Panel */}
        <Card className="lg:col-span-1 border dark:border-gray-800 shadow-sm glass-card overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-900/60 border-b dark:border-gray-800 py-3.5 px-5">
            <CardTitle className="text-base font-bold flex items-center gap-2">⚡ Operations Toolkit</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2.5 p-5">
            <Link href="/admin/dashboard/medicine/list" className="w-full">
              <Button variant="outline" className="w-full justify-start text-xs font-semibold py-2">
                ➕ Add New Medicine Catalog
              </Button>
            </Link>
            <Link href="/admin/dashboard/customers/add" className="w-full">
              <Button variant="outline" className="w-full justify-start text-xs font-semibold py-2">
                🐾 Register New Customer Record
              </Button>
            </Link>
            <Link href="/admin/dashboard/customers/all" className="w-full">
              <Button variant="outline" className="w-full justify-start text-xs font-semibold py-2">
                👤 Client Profiles Registry
              </Button>
            </Link>
            <Link href="/admin/dashboard/orders" className="w-full">
              <Button className="w-full justify-start text-xs font-bold py-2 bg-blue-600 hover:bg-blue-700 text-white">
                📦 Open Orders Dashboard ({pendingOrders} Pending)
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Upcoming Appointments schedule */}
        <Card className="lg:col-span-2 border dark:border-gray-800 shadow-sm glass-card overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-900/60 border-b dark:border-gray-800 py-3.5 px-5 flex flex-row justify-between items-center">
            <CardTitle className="text-base font-bold flex items-center gap-2">📅 Upcoming Appointments</CardTitle>
            <Link href="/admin/dashboard/appointments">
              <Button size="sm" variant="ghost" className="text-xs hover:text-purple-500">
                All Bookings <FaArrowRight className="ml-1 text-[10px]" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingAppts.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-xs">
                No upcoming appointments pending or approved.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Pet</TableHead>
                    <TableHead>Service / Type</TableHead>
                    <TableHead>Date / Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppts.map((appt) => (
                    <TableRow key={appt.id}>
                      <TableCell className="font-semibold text-xs">{appt.user.name}</TableCell>
                      <TableCell className="text-xs">🐾 {appt.pet.name}</TableCell>
                      <TableCell className="text-xs">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {appt.type.replace(/_/g, " ")}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {new Date(appt.date).toLocaleDateString()} at {new Date(appt.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </div>

    </div>
  );
}

/* Stat Card Component */
function StatCard({
  icon,
  label,
  value,
  iconBg,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg: string;
  highlight?: boolean;
}) {
  return (
    <Card className={`hover:shadow-lg transition-all duration-300 border dark:border-gray-800 shadow-sm glass-card ${highlight ? 'ring-1 ring-red-500/50' : ''}`}>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`p-3.5 rounded-full ${iconBg}`}>{icon}</div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
          <h2 className={`text-3xl font-extrabold mt-1 ${highlight ? 'text-red-500' : ''}`}>{value}</h2>
        </div>
      </CardContent>
    </Card>
  );
}
