"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconVideo,
  IconCategory,
  IconClock,
  IconTicket,
  IconCreditCard,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Dashboard from "./dashboard";
import Users from "./users";
import Movies from "./movies";
import Settings from "./settings";
import Logout from "./logout";
import Genre from "./genre";
import Image from "next/image";
import Showtimes from "./showtime";
import Reservations from "./reservation";
import Cinemas from "./cinema";
import Payments from "./payment";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/AuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/utils/apiFetch";

export default function AdminHome() {
  const [active, setActive] = useState("dashboard");
  const [open, setOpen] = useState(true);

  type UserProfile = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  // Sidebar links (no logout)
  const links = [
    { id: "dashboard", label: "Dashboard", icon: <IconBrandTabler className="h-5 w-5 rounded-4xl shrink-0" /> },
    { id: "users", label: "Utilisateurs", icon: <IconUserBolt className="h-5 w-5 rounded-4xl shrink-0" /> },
    { id: "movies", label: "Films", icon: <IconVideo className="h-5 w-5 rounded-4xl shrink-0" /> },
    { id: "genre", label: "Genres", icon: <IconCategory className="h-5 w-5 rounded-4xl shrink-0" /> },
    { id: "showtimes", label: "Séances", icon: <IconClock className="h-5 w-5 rounded-4xl shrink-0" /> },
    { id: "reservations", label: "Réservations", icon: <IconTicket className="h-5 w-5 rounded-4xl shrink-0" /> },
    { id: "cinema", label: "Cinéma", icon: <IconVideo className="h-5 w-5 rounded-4xl shrink-0" /> },
    { id: "payments", label: "Paiements", icon: <IconCreditCard className="h-5 w-5 rounded-4xl shrink-0" /> },
    { id: "settings", label: "Paramètres", icon: <IconSettings className="h-5 w-5 rounded-4xl shrink-0" /> },
  ];

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/api/user/user-profile");
        setProfile(response);
      } catch {
        console.error("User profile fetch error");
      }
    };
    fetchUserProfile();
  }, []);

  // Handle logout
  const logout = () => {
    useAuthStore.getState().logout();
    setActive("logout");
    toast.success("Déconnexion réussie !", {
      duration: 5000,
      style: {
        border: "1px solid #4ade80",
        background: "#ecfdf5",
        color: "#065f46",
      },
    });
    router.push("/login");
  };

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex flex-col h-full justify-between gap-2">
          {/* Top Section */}
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link) => (
                <div
                  key={link.id}
                  onClick={() => setActive(link.id)}
                  style={{ cursor: "pointer" }}
                >
                  <SidebarLink
                    link={{
                      label: link.label,
                      href: "#",
                      icon: link.icon,
                    }}
                    className={cn(
                      "text-sm font-medium",
                      active === link.id
                        ? "bg-red-600 p-2 rounded-full text-white"
                        : "p-2"
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section: Profile Dropdown */}
          <div className="mb-4 flex flex-col items-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full p-2 transition"
                  tabIndex={0}
                >
                  <Image
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    alt="Avatar"
                    width={28}
                    height={28}
                  />
                  {/* Only show the name when sidebar is open */}
                  {open && (
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {profile
                        ? `${profile.firstName} ${profile.lastName}`
                        : "Profil"}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white dark:bg-neutral-800 shadow-xl rounded-xl border border-neutral-200 dark:border-neutral-700"
              >
                <DropdownMenuItem asChild className="flex gap-2 items-center text-neutral-900 dark:text-white focus:bg-neutral-100 dark:focus:bg-neutral-700">
                  <Link href="/profile">
                    <IconUser className="h-4 w-4 mr-2" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex gap-2 items-center text-red-600 focus:bg-red-100 dark:focus:bg-red-900"
                  onClick={logout}
                >
                  <IconLogout className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main content area */}
      <main className="flex-1 p-6 overflow-auto bg-white dark:bg-neutral-800">
        {active === "dashboard" && <Dashboard />}
        {active === "users" && <Users />}
        {active === "movies" && <Movies />}
        {active === "genre" && <Genre />}
        {active === "showtimes" && <Showtimes />}
        {active === "reservations" && <Reservations />}
        {active === "cinema" && <Cinemas />}
        {active === "payments" && <Payments />}
        {active === "settings" && <Settings />}
        {active === "logout" && <Logout />}
      </main>
    </div>
  );
}

// Logo components using the custom SVG
const Logo = () => (
  <a
    href="#"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <img
      src="/KaguyaCine logo svg.svg"
      alt="KaguyaCine Logo"
      className="h-8 w-8 rounded-lg bg-white dark:bg-transparent"
      style={{ minWidth: 40, minHeight: 40 }}
    />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre text-black dark:text-white"
    >
      KaguyaCine LAB
    </motion.span>
  </a>
);

const LogoIcon = () => (
  <a
    href="#"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <img
      src="/KaguyaCine logo svg.svg"
      alt="KaguyaCine Logo"
      className="h-8 w-8 rounded-lg bg-white dark:bg-transparent"
      style={{ minWidth: 40, minHeight: 40 }}
    />
  </a>
);
