"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/apiFetch";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<null | boolean>(null);
  const router = useRouter();

  useEffect(() => {
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

  if (!auth) return null;

  return <>{children}</>;
}
