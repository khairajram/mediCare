"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Reminder {
  id: string;
  medicineName: string;
  userName: string;
  petName: string;
  dateGiven: string;
  nextDoseDate?: string;
  reminder?: string | null;
  isCompleted?: boolean;
  status?: string;
  daysLeft?: number;
}

export default function RemindersPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState<any[]>([]);
  const [daysFilter, setDaysFilter] = useState<"all" | "5" | "10">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "Pending" | "Sent" | "Completed">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);


  useEffect(() => {
    const fetchMedicines = async () => {
      const res = await fetch("/api/medicine?days=0");
      const data = await res.json();

      const mapped: Reminder[] = data.medicines
      .filter((m: any) => m.Medicine?.type === "INJECTION")
      .map((m: any) => {
        const status =
          m.reminder && m.isCompleted === false
            ? "Sent"
            : !m.reminder
            ? "Pending"
            : "Completed";

        const dueDate = new Date(m.nextDoseDue || m.dateGiven);
        const today = new Date();
        const diffDays = Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          id: m.id,
          medicineName: m.Medicine?.name || "Unknown",
          userName: m.pet?.user?.name || "Unknown User",
          userId: m.pet?.user?.id || "Unknown User",
          email: m.pet?.user?.email || "",
          petName: m.pet?.name || "Unknown Pet",
          dateGiven: m.dateGiven,
          nextDoseDate: m.nextDoseDue,
          reminder: m.reminder,
          isCompleted: m.isCompleted,
          status,
          daysLeft: diffDays,
        };
      });




      setReminders(mapped);
    };

    fetchMedicines();
  }, []);

  function formatDate(isoDate?: string) {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  }

  // ✅ Filter by both days & status
  const filteredReminders = reminders.filter((r) => {
    const matchesDays =
      daysFilter === "all" ? true : r.daysLeft === Number(daysFilter);
    const matchesStatus =
      statusFilter === "all" ? true : r.status === statusFilter;
    return matchesDays && matchesStatus;
  });

  // ✅ Select/Deselect reminders
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredReminders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredReminders.map((r) => r.id));
    }
  };

  const sendBulkReminders = async () => {
      if (selectedIds.length === 0) {
        return alert("No reminders selected!");
      }

      try {
        const remindersToSend = reminders.filter((rem) => selectedIds.includes(rem.id));

        if (remindersToSend.length === 0) {
          return alert("No matching reminders found!");
        }

        // Send one by one (or you can batch send to API)
        await Promise.all(
          remindersToSend.map(async (rem) => {
            await fetch("/api/message/reminder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: rem.userName,
                email: rem.email,
                petName: rem.petName,
                medicineName: rem.medicineName,
                dueDate: rem.nextDoseDate || rem.dateGiven,
              }),
            });
          })
        );

        alert(`✅ Sent ${remindersToSend.length} reminders successfully!`);
        setSelectedIds([]); // clear selection after sending
      } catch (err) {
        console.error("Bulk reminder error:", err);
        alert("❌ Failed to send reminders. Check console for details.");
      }
    };


  const reminder = async (rem: {
  name: string;
  email: string;
  petName: string;
  medicineName: string;
  dueDate: string | Date;
}) => {
  try {
    const res = await fetch("/api/message/reminder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...rem,
        dueDate: new Date(rem.dueDate).toISOString(), 
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to send reminder");

    return data; // success response
  } catch (err: any) {
    console.error("Reminder error:", err.message);
    return { error: err.message };
  }
};


  return (
    <div className="p-6 dark:text-white text-gray-800 bg-white dark:bg-[#1E1E1E]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Reminders</h1>
        <Link href={"/admin/dashboard/customers"}>
          <Button variant="link" onClick={() => router.back()}>
            ← Back
          </Button>
        </Link>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <label className="font-medium">Days Left:</label>
        <Select value={daysFilter} onValueChange={(val: any) => setDaysFilter(val)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="5">5 Days</SelectItem>
            <SelectItem value="10">10 Days</SelectItem>
          </SelectContent>
        </Select>

        <label className="font-medium">Status:</label>
        <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Sent">Sent</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={sendBulkReminders}>
          <FaBell className="mr-1" /> Send Selected ({selectedIds.length})
        </Button>
      </div>

      {/* Table */}
      <div className="mt-2 rounded-md border shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={selectedIds.length === filteredReminders.length && filteredReminders.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Pet</TableHead>
              <TableHead>Medicine</TableHead>
              <TableHead>Next Dose Date</TableHead>
              <TableHead>Last Reminder</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReminders.map((rem) => (
              <TableRow key={rem.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(rem.id)}
                    onCheckedChange={() => toggleSelect(rem.id)}
                  />
                </TableCell>
                <Link href={`/admin/dashboard/customers/${rem.userId}`}>
                <TableCell>{rem.userName}</TableCell>
                </Link>
                <TableCell>{rem.petName}</TableCell>
                <TableCell>{rem.medicineName}</TableCell>
                <TableCell>{formatDate(rem.nextDoseDate || rem.dateGiven)}</TableCell>
                <TableCell>{formatDate(rem.reminder)}</TableCell>
                <TableCell
                  className={`${
                    rem.status === "Pending"
                      ? "text-orange-500 font-semibold"
                      : rem.status === "Sent"
                      ? "text-blue-500 font-semibold"
                      : "text-green-600 font-semibold"
                  }`}
                >
                  {rem.status}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() =>
                      reminder({
                        name: rem.userName,
                        email: rem.email || "",
                        petName: rem.petName,
                        medicineName: rem.medicineName,
                        dueDate: rem.nextDoseDate || rem.dateGiven,
                      })
                    }
                  >
                    <FaBell className="mr-1" /> Send
                  </Button>

                </TableCell>
              </TableRow>
            ))}

            {filteredReminders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                  No reminders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
