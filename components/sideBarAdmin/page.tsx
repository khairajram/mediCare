"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode, useState } from "react"
import { FaHome, FaUsers, FaTruck, FaPills, FaScroll, FaCog, FaChevronUp, FaChevronDown } from "react-icons/fa"

export function SideBarAdmin() {
  const pathname = usePathname()
  const [customerOpen, setCustomerOpen] = useState(false)

  return (
    <aside className="w-52 border-r border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#121212] hidden md:flex flex-col transition-colors duration-200 pl-3 pr-3 py-4 fixed h-screen">
    <nav aria-label="Main navigation">

      <Navigation icon={<FaHome />} name="Home" href="/admin/dashboard" isActive={pathname === "/admin/dashboard"} />

      <Navigation icon={<FaUsers />} name="Customers" href="/admin/dashboard/customers" isActive={pathname.startsWith("/admin/dashboard/customers")} />
      
      <Navigation icon={<FaTruck />} name="Orders" href="/admin/dashboard/orders" isActive={pathname.startsWith("/admin/dashboard/orders")}/>

      <Navigation icon={<FaPills />} name="Medicines" href="/admin/dashboard/medicine" isActive={pathname === "/admin/dashboard/medicine"} />

      <Navigation icon={<FaScroll />} name="Recent" href="/admin/dashboard/recent" isActive={pathname === "/admin/dashboard/recent"} />

    </nav>

    {/* Sticky bottom settings */}
    <nav className="border-t border-[#E2E8F0] dark:border-[#334155] pt-4 mt-4" aria-label="Settings">
      <Navigation icon={<FaCog />} name="Settings" href="/admin/dashboard/settings" isActive={pathname === "/admin/dashboard/settings"} />
    </nav>
  </aside>

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
    <Link href={href} >
      <div
        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors duration-200 mt-1
        ${isActive ? "bg-[#5077aa] text-white" : "hover:bg-[#F1F5F9] dark:hover:bg-[#2A2A2A] text-[#475569] dark:text-[#CBD5E1]"}`}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="text-xl">{icon}</span>
        <span className="text-base">{name}</span>
      </div>
    </Link>
  )
}
