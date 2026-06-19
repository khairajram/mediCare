"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode, useState } from "react"
import { FaHome, FaUsers, FaTruck, FaPills, FaScroll, FaCog, FaBars, FaTimes, FaCalendarCheck } from "react-icons/fa"

export function SideBarAdmin() {
  const pathname = usePathname()
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false)

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-16 left-0 z-50 md:hidden p-2 rounded-r-xl bg-blue-500/10 border-y border-r border-blue-500/20 text-blue-500 backdrop-blur-md"
        onClick={() => setIsSideBarOpen(true)}
      >
        <FaBars className="text-xl animate-pulse" />
      </button>

      {/* Sidebar (desktop & mobile) */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-64px)] w-64 bg-white/40 dark:bg-[#070b13]/40 backdrop-blur-xl border-r border-slate-200/40 dark:border-slate-800/40
        transform transition-transform duration-300 ease-in-out z-40 shadow-xl
        ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:flex md:flex-col`}
      >
        {/* Close button on mobile */}
        <div className="flex justify-between items-center md:hidden p-4 border-b dark:border-slate-800/40">
          <h2 className="text-base font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">MediCare Admin</h2>
          <button onClick={() => setIsSideBarOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <FaTimes className="text-xl" />
          </button>
        </div>

        <nav aria-label="Main navigation" className="px-3 py-6 space-y-1">
          <Navigation icon={<FaHome />} name="Home" href="/admin/dashboard" isActive={pathname === "/admin/dashboard"} />
          <Navigation icon={<FaUsers />} name="Customers" href="/admin/dashboard/customers" isActive={pathname.startsWith("/admin/dashboard/customers")} />
          <Navigation icon={<FaCalendarCheck />} name="Appointments" href="/admin/dashboard/appointments" isActive={pathname.startsWith("/admin/dashboard/appointments")} />
          <Navigation icon={<FaTruck />} name="Orders" href="/admin/dashboard/orders" isActive={pathname.startsWith("/admin/dashboard/orders")} />
          <Navigation icon={<FaPills />} name="Medicines" href="/admin/dashboard/medicine" isActive={pathname.startsWith("/admin/dashboard/medicine")} />
          <Navigation icon={<FaScroll />} name="Recent" href="/admin/dashboard/recent" isActive={pathname === "/admin/dashboard/recent"} />
        </nav>

        <nav className="border-t border-[#E2E8F0] dark:border-[#334155]/40 px-3 py-4 mt-auto" aria-label="Settings">
          <Navigation icon={<FaCog />} name="Settings" href="/admin/dashboard/settings" isActive={pathname === "/admin/dashboard/settings"} />
        </nav>
      </aside>

      {/* Overlay when sidebar is open on mobile */}
      {isSideBarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSideBarOpen(false)}
        />
      )}
    </>
  )
}

type Props = {
  icon: ReactNode
  name: string
  href: string
  isActive: boolean
}

function Navigation({ icon, name, href, isActive }: Props) {
  return (
    <Link href={href}>
      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 mt-1.5 group
        ${isActive 
          ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold shadow-sm" 
          : "hover:bg-slate-100/50 dark:hover:bg-slate-900/50 border border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`}
        aria-current={isActive ? "page" : undefined}
      >
        {/* Glowing left bar */}
        {isActive && (
          <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-md" />
        )}
        <span className={`text-lg transition-transform group-hover:scale-110 duration-200 ${isActive ? 'text-blue-500' : ''}`}>{icon}</span>
        <span className="text-sm font-medium tracking-wide">{name}</span>
      </div>
    </Link>
  )
}
