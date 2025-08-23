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
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default function AdminDashboardHome() {

  const { medicines,users } = useData();
  const lowStock = medicines.filter(m => m.quantityInStock< m.minimumStockLevel)
  const totalPets = (users: { _count: { pets: number } }[]) => {
    return users.reduce((sum, user) => sum + user._count.pets, 0);
  };

  const pets = totalPets(users);




  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen dark:text-white text-gray-800 bg-gray-100 dark:bg-[#1E1E1E] space-y-10">


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaPills size={22} />}
          label="Total Medicines"
          value={String(medicines.length)}
          iconBg="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={<FaExclamationTriangle size={22} />}
          label="Low Stock Alerts"
          value={String(lowStock.length)}
          iconBg="bg-red-100 text-red-600"
        />
        <StatCard
          icon={<MdPets size={22} />}
          label="Pet Health Records"
          value={String(pets)}
          iconBg="bg-green-100 text-green-600"
        />
        <StatCard
          icon={<HiUsers size={22} />}
          label="Registered Users"
          value={String(users.length)}
          iconBg="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
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
                {lowStock.length > 0 ? (
                lowStock.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell>{med.name}</TableCell>
                    <TableCell>{med.type}</TableCell>
                    <TableCell>{med.quantityInStock}</TableCell>
                    <TableCell>{med.minimumStockLevel}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400 py-4">
                    ✅ All medicines are in stock
                  </TableCell>
                </TableRow>
              )}
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

            <Link href={'/admin/dashboard/medicine/list'}>
              <Button className="flex-1 sm:flex-none">➕ Add Medicine</Button>
            </Link>
            <Link href={'/admin/dashboard/customers/add'}>
              <Button variant="outline" className="flex-1 sm:flex-none">🐾 Add User Record</Button>
            </Link>
            <Link href={'/admin/dashboard/customers/all'}>
              <Button variant="outline" className="flex-1 sm:flex-none">👤 Manage Users</Button>
            </Link>            
            
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
