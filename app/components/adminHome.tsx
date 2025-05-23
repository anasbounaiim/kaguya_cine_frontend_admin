"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconVideo,
  IconLogout,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Dashboard from "./dashboard";
import Users from "./users";
import Movies from "./movies";
import Settings from "./settings";
import Logout from "./logout";
import Image from "next/image";

export default function AdminHome() {
  const [active, setActive] = useState("dashboard");

  const links = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <IconBrandTabler className="h-5 w-5 rounded-4xl shrink-0" />,
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
      id: "settings",
      label: "Paramètres",
      icon: <IconSettings className="h-5 w-5 rounded-4xl shrink-0" />,
    },
    {
      id: "logout",
      label: "Déconnexion",
      icon: <IconLogout className="h-5 w-5 rounded-4xl shrink-0" />,
    },
  ];

  const [open, setOpen] = useState(true);

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={{
                    label: link.label,
                    href: "#",
                    icon: link.icon,
                  }}
                  className={cn(
                    "text-sm font-medium",
                    active === link.id ? "bg-red-600 p-2  rounded-full text-white" : "p-2"
                  )}
                  onClick={() => setActive(link.id)}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    alt="Avatar"
                    width={7}
                    height={7}
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 p-6 overflow-auto bg-white dark:bg-neutral-800">
        {active === "dashboard" && <Dashboard />}
        {active === "users" && <Users/>}
        {active === "movies" && <Movies/>}
        {active === "settings" && <Settings />}
        {active === "logout" && <Logout />}
      </main>
    </div>
  );
}

// Logo components
const Logo = () => (
  <a
    href="#"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
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
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
  </a>
);

