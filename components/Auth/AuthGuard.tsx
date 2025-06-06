"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/apiFetch"; // ou simplement fetch

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<null | boolean>(null);
  const router = useRouter();

  useEffect(() => {
    // Vérifie l’authentification en appelant l’API route
    api
      .get("/api/auth/me")
      .then(() => setAuth(true))
      .catch(() => {
        setAuth(false);
        router.replace("/login");
      });
  }, [router]);

  if (auth === null)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <span>Chargement...</span>
      </div>
    );

  if (!auth) return null; // Redirection vers /login

  return <>{children}</>;
}
