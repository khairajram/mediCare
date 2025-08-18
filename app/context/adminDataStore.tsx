"use client"

import { createContext, useContext, useState, useEffect } from "react";

export type Medicine = { id: string; name: string; type: string; dose?: string };
export type User = { id: string, name: string, phoneNo : string, address? : string };

const dataContext = createContext<{ 
  medicines: Medicine[], 
  refreshMedicine : () => void,
  users: User[], 
  refreshUsers : () => void 
}>({ medicines: [], refreshMedicine: () => {} , users : [] ,refreshUsers : () => {} });

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [users, setusers] = useState<User[]>([]);

  const refreshMedicine = async () => {
    try {
      const res = await fetch("/api/MedicineRecord/medicineMaster");
      if (!res.ok) throw new Error("Failed to fetch medicines");
      const data = await res.json();
      setMedicines(data.medicines || []);
    } catch (err) {
      console.error(err);
    }
  };


  const refreshUsers = async () => {
    try {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setusers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshMedicine();
    refreshUsers();
  }, []);

  return (
    <dataContext.Provider value={{ medicines, refreshMedicine,users, refreshUsers}}>
      {children}
    </dataContext.Provider>
  );
};

export const useData = () => useContext(dataContext);
