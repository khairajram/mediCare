import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode, useState } from "react"
import { FaHome, FaUsers, FaTruck, FaPills, FaScroll, FaCog, FaBars, FaTimes } from "react-icons/fa"

export function SideBarAdmin() {
  const pathname = usePathname()
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false)

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-16 left-0 z-50 md:hidden p-2 rounded-md bg-gray-200 dark:bg-gray-800"
        onClick={() => setIsSideBarOpen(true)}
      >
        <FaBars className="text-xl" />
      </button>

      {/* Sidebar (desktop & mobile) */}
      <aside
        className={`fixed top-16 left-0 h-screen w-64 bg-[#F8FAFC] dark:bg-[#121212] border-r border-[#E2E8F0] dark:border-[#334155] 
        transform transition-transform duration-300 ease-in-out z-40
        ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:flex md:flex-col`}
      >
        {/* Close button on mobile */}
        <div className="flex justify-between items-center md:hidden p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setIsSideBarOpen(false)}>
            <FaTimes className="text-xl" />
          </button>
        </div>

        <nav aria-label="Main navigation" className="px-3 py-4">
          <Navigation icon={<FaHome />} name="Home" href="/admin/dashboard" isActive={pathname === "/admin/dashboard"} />
          <Navigation icon={<FaUsers />} name="Customers" href="/admin/dashboard/customers" isActive={pathname.startsWith("/admin/dashboard/customers")} />
          <Navigation icon={<FaTruck />} name="Orders" href="/admin/dashboard/orders" isActive={pathname.startsWith("/admin/dashboard/orders")} />
          <Navigation icon={<FaPills />} name="Medicines" href="/admin/dashboard/medicine" isActive={pathname === "/admin/dashboard/medicine"} />
          <Navigation icon={<FaScroll />} name="Recent" href="/admin/dashboard/recent" isActive={pathname === "/admin/dashboard/recent"} />
        </nav>

        <nav className="border-t border-[#E2E8F0] dark:border-[#334155] px-3 py-4 mt-auto" aria-label="Settings">
          <Navigation icon={<FaCog />} name="Settings" href="/admin/dashboard/settings" isActive={pathname === "/admin/dashboard/settings"} />
        </nav>
      </aside>

      {/* Overlay when sidebar is open on mobile */}
      {isSideBarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
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
