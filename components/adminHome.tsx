"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconSettings,
  IconUserBolt,
  IconVideo,
  IconCategory,
  IconClock,
  IconTicket,
  IconCreditCard,
  IconLogout,
  IconUser,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Dashboard from "./dashboard";
import Users from "./users";
import Movies from "./movies";
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
import Profile from "./profile";

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

  const links = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <IconLayoutDashboard className="h-5 w-5 rounded-4xl shrink-0" />,
    },
    {
      id: "users",
      label: "Utilisateurs",
      icon: <IconUserBolt className="h-5 w-5 rounded-4xl shrink-0" />,
    },
    {
      id: "movies",
      label: "Films",
      icon: <IconVideo className="h-5 w-5 rounded-4xl shrink-0" />,
    },
    {
      id: "genre",
      label: "Genres",
      icon: <IconCategory className="h-5 w-5 rounded-4xl shrink-0" />,
    },
    {
      id: "showtimes",
      label: "Séances",
      icon: <IconClock className="h-5 w-5 rounded-4xl shrink-0" />,
    },
    {
      id: "reservations",
      label: "Réservations",
      icon: <IconTicket className="h-5 w-5 rounded-4xl shrink-0" />,
    },
    {
      id: "cinema",
      label: "Cinéma",
      icon: <IconVideo className="h-5 w-5 rounded-4xl shrink-0" />,
    },
    {
      id: "payments",
      label: "Paiements",
      icon: <IconCreditCard className="h-5 w-5 rounded-4xl shrink-0" />,
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: <IconSettings className="h-5 w-5 rounded-4xl shrink-0" />,
    },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/api/user/user-profile");
        console.log("User profile fetched:", response);
        setProfile(response);
        useAuthStore.getState().setProfile(response);
      } catch {
        console.error("User profile fetch error");
      }
    };
    fetchUserProfile();
  }, []);

  const logout = async () => {
  try {
    await api.post("/api/auth/logout", {});
    setActive("logout");
    setProfile(null);
    toast.success("Déconnexion réussie !", {
      duration: 5000,
      style: {
        border: "1px solid #4ade80",
        background: "#ecfdf5",
        color: "#065f46",
      },
    });
    router.push("/login");
  } catch {
    toast.error("Erreur lors de la déconnexion", {
      duration: 5000,
      style: {
        border: "1px solid #f87171",
        background: "#fee2e2",
        color: "#b91c1c",
      },
    });
  }
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
                        ? "p-2 rounded-full text-red-600"
                        : "p-2"
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section: Profile Dropdown */}
          <div className="mb-4 flex flex-col items-start">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full p-1 transition"
                  tabIndex={0}
                >
                  <Image
                    src={
                      profile
                        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            profile.firstName + " " + profile.lastName
                          )}`
                        : "https://ui-avatars.com/api/?name=User"
                    }
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
              {open && (
                <DropdownMenuContent
                  align="start"
                  className="w-48 bg-white dark:bg-neutral-800 shadow-xl rounded-xl border border-neutral-200 dark:border-neutral-700"
                >
<DropdownMenuItem
  className="cursor-pointer font-medium flex gap-2 items-center text-neutral-900 dark:text-white focus:bg-neutral-100 dark:focus:bg-neutral-700"
  onClick={() => setActive("profile")}
>
  <IconUser className="h-4 w-4 mr-2" />
  Profil
</DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer font-medium flex gap-2 items-center text-red-600 focus:bg-red-100 dark:focus:bg-red-900"
                    onClick={logout}
                  >
                    <IconLogout className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main content area */}
      <main className="flex-1 py-5 px-6 overflow-auto bg-white dark:bg-neutral-800">
        {active === "dashboard" && <Dashboard />}
        {active === "users" && <Users />}
        {active === "movies" && <Movies />}
        {active === "genre" && <Genre />}
        {active === "showtimes" && <Showtimes />}
        {active === "reservations" && <Reservations />}
        {active === "cinema" && <Cinemas />}
        {active === "payments" && <Payments />}
        {active === "settings" && <Profile />}
{active === "profile" && <Profile />}
      </main>
    </div>
  );
}

// Logo components using the custom SVG
const Logo = () => (
  <Link
    href="/"
    className="relative z-20 flex items-center space-x-2 px-0.5 py-1 text-sm font-normal text-black"
  >
    <Image
      width={30}
      height={30}
      src="/KaguyaCine logo svg.svg"
      alt="KaguyaCine Logo"
      className="rounded-lg bg-red-600 h-8 w-8"
    />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre text-black dark:text-white"
    >
      KaguyaCine LAB
    </motion.span>
  </Link>
);

const LogoIcon = () => (
  <Link
    href="/"
    className="relative z-20 flex items-center space-x-2 px-0.5 py-1 text-sm font-normal text-black"
  >
    <Image
      width={30}
      height={30}
      src="/KaguyaCine logo svg.svg"
      alt="KaguyaCine Logo"
      className="rounded-lg bg-red-600 h-8 w-8"
    />
  </Link>
);
