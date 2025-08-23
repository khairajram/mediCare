"use client"

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
import { FaPills, FaExclamationTriangle } from "react-icons/fa";
import { MdPets } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import { useData } from "@/app/context/adminDataStore";

export default async function AdminDashboardHome() {

  const { medicines } = useData();

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen dark:text-white text-gray-800 bg-gray-100 dark:bg-[#1E1E1E] space-y-10">

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaPills size={22} />}
          label="Total Medicines"
          value="254"
          iconBg="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={<FaExclamationTriangle size={22} />}
          label="Low Stock Alerts"
          value="12"
          iconBg="bg-red-100 text-red-600"
        />
        <StatCard
          icon={<MdPets size={22} />}
          label="Pet Health Records"
          value="87"
          iconBg="bg-green-100 text-green-600"
        />
        <StatCard
          icon={<HiUsers size={22} />}
          label="Registered Users"
          value="42"
          iconBg="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Middle Section: Low Stock + Quick Actions side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Low Stock Medicines */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b">
            <CardTitle className="text-lg">⚠️ Low Stock Medicines</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Min Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Paracetamol</TableCell>
                  <TableCell>Tablet</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>20</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Amoxicillin</TableCell>
                  <TableCell>Syrup</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>15</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b">
            <CardTitle className="text-lg">⚡ Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 p-6">
            <Button className="flex-1 sm:flex-none">➕ Add Medicine</Button>
            <Button variant="secondary" className="flex-1 sm:flex-none">📊 View Reports</Button>
            <Button variant="outline" className="flex-1 sm:flex-none">🐾 Add Pet Record</Button>
            <Button variant="outline" className="flex-1 sm:flex-none">👤 Manage Users</Button>
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`p-3 rounded-full ${iconBg}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
      </CardContent>
    </Card>
  );
}
