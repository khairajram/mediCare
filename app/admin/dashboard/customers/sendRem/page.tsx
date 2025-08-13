// app/admin/dashboard/reminders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBell, FaSearch } from "react-icons/fa";
import Link from "next/link";

interface Reminder {
  id: string;
  medicineName : string;
  user_id : string;
  userName: string;
  pet_id : string;
  petName: string;
  dateGiven: Date;
  dueDate: Date;
  lastReminder: string;
  status: "Pending" | "Completed" | "Overdue";
}

export default function RemindersPage() {
  const router = useRouter();

  const [reminders, setReminders] = useState<Reminder[]>([]);

  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const sendReminder = (id: string) => {
    alert(`Reminder sent to customer ID: ${id}`);
  };

  const sendBulkReminders = () => {
    alert(`Bulk reminders sent to: ${selected.join(", ")}`);
  };

  useEffect(() => {
  const fetchMedicines = async () => {
    const res = await fetch('/api/medicine/dueMedicines?days=0');
    const data = await res.json(); 
    setReminders(data.medicines); 
  };

  fetchMedicines();
}, []);

  function getDate(isoDate : Date){
    const date = new Date(isoDate);

    const formatted = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;

    return formatted; 
  }


  return (
    <div className="p-6 dark:text-white text-gray-800 bg-white dark:bg-[#1E1E1E] ">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Reminders</h1>
        <Link href={'/admin/dashboard/customers'}>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back
          </button>
        </Link>
      </div>

      <div className="flex justify-between mb-4 gap-4">

        <div className="flex items-center border rounded px-3 py-2 w-full max-w-sm">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by customer or pet..."
            className="outline-none w-full bg-transparent"
          />
        </div>

        {selected.length > 0 && (
          <button
            onClick={sendBulkReminders}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send Bulk Reminder
          </button>
        )}
      </div>

      <div className="overflow-x-auto  rounded shadow">
        <table className="min-w-full text- text-left">
          <thead className=  " bg-gray-300 dark:bg-[#1a1515] text-gray-800 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked
                      ? setSelected(reminders.map((r) => r.id))
                      : setSelected([])
                  }
                  checked={selected.length === reminders.length}
                />
              </th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Pet</th>
              <th className="px-4 py-3">Medicine</th>
              <th className="px-4 py-3">Given Date</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Last Reminder</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((reminder) => (
              <tr
                key={reminder.id}
                className="border-b hover:bg-gray-200 dark:hover:bg-[#302929]"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(reminder.id)}
                    onChange={() => toggleSelect(reminder.id)}
                  />
                </td>
                <td className="px-4 py-3">{reminder.userName}</td>
                <td className="px-4 py-3">{reminder.petName}</td>
                <td className="px-4 py-3">{reminder.medicineName}</td>
                <td className="px-4 py-3">{getDate(reminder.dateGiven)}</td>
                <td
                  className={`px-4 py-3 ${
                    reminder.status === "Overdue"
                      ? "text-red-600 font-semibold"
                      : reminder.status === "Pending"
                      ? "text-orange-500"
                      : "text-green-600"
                  }`}
                >
                  {getDate(reminder.dueDate)}
                </td>
                <td className="px-4 py-3">{reminder.lastReminder}</td>
                <td className="px-4 py-3">{reminder.status}</td>
                <td className="pl-1 py-3 text-right">
                  <button
                    onClick={() => sendReminder(reminder.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-600"
                  >
                    <FaBell /> Send
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 dark:text-white text-gray-800 bg-white dark:bg-[#1d1c1c] p-4">
        <h2 className="text-lg font-semibold mb-3">Recently Sent Reminders</h2>
        <ul className=" rounded shadow p-4 space-y-2 text-sm overflow-y-auto max-h-48">
          <li>2025-08-05 → John Doe for Buddy</li>
          <li>2025-08-01 → Sarah Lee for Milo</li>
          <li>2025-08-01 → Sarah Lee for Milo</li>
          <li>2025-08-01 → Sarah Lee for Milo</li>
          <li>2025-08-01 → Sarah Lee for Milo</li>
          <li>2025-08-01 → Sarah Lee for Milo</li>
          <li>2025-08-01 → Sarah Lee for Milo</li>
          <li>2025-08-01 → Sarah Lee for Milo</li>
          <li>2025-08-01 → Sarah Lee for Milo</li>
          <li>2025-08-01 → Sarah Lee for Milo</li>
          <li>2025-08-01 → Sarah Lee for Milo</li>
          <li>2025-08-01 → Sarah Lee for Milo</li>
        </ul>
      </div>
    </div>
  );
}
