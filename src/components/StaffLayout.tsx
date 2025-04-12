import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function StaffLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const links = [
    {
      label: "Dashboard",
      href: "/staff/dashboard",
      icon: (
        <LayoutDashboard className="text-[#F2C300] h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Products",
      href: "/staff/products",
      icon: (
        <Package className="text-[#F2C300] h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Orders",
      href: "/staff/orders",
      icon: (
        <ShoppingCart className="text-[#F2C300] h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/staff/settings",
      icon: (
        <Settings className="text-[#F2C300] h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "/auth",
      icon: (
        <LogOut className="text-[#F2C300] h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-neutral-900 w-full">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex flex-col v-full">
          <div className="flex flex-col min-h-0">
            {open ? <Logo /> : <LogoIcon />}
            <nav className="mt-8 flex-1">
              <div className="flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </nav>
          </div>
          <SidebarLink
            className="mt-auto pt-4 border-t border-[#F2C300]/20"
            link={{
              label: "Staff Account",
              href: "/staff/settings",
              icon: (
                <div className="h-7 w-7 flex-shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center">
                  <span className="text-sm text-[#F2C300]">S</span>
                </div>
              ),
            }}
          />
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 mt-12 md:mt-0 overflow-x-hidden w-full">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

const Logo = () => (
  <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
    <div className="h-5 w-6 bg-[#F2C300] rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-black dark:text-white whitespace-pre"
    >
      HK System
    </motion.span>
  </div>
);

const LogoIcon = () => (
  <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
    <div className="h-5 w-6 bg-[#F2C300] rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
  </div>
);
