"use client";

import Image from "next/image";
import { useAuthStore } from "@/store/AuthStore";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const profile = useAuthStore((state) => state.profile);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordReset = () => {
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    // 👇 Make an API call here (add token in URL or store it based on your flow)
    console.log("New password to submit:", newPassword);
  };

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-neutral-500">
        Chargement du profil...
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-transparent">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col items-center">
          <Image
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile.firstName + " " + profile.lastName
            )}`}
            alt="Avatar"
            width={90}
            height={90}
            className="rounded-full border-4 border-red-600 shadow mb-4"
          />
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            {profile.email}
          </p>
          <div className="w-full space-y-4 mt-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                Rôle
              </span>
              <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 rounded-full text-xs">
                {profile.role}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                Téléphone
              </span>
              <span className="text-neutral-800 dark:text-neutral-200">
                +212 600-000000
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3 mt-8">
            <button className="w-full px-5 py-2 bg-red-600 text-white rounded-full font-semibold shadow hover:bg-red-700 transition">
              Modifier le profil
            </button>

            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full px-5 py-2 bg-transparent border-2 border-red-600 text-red-600 rounded-full font-semibold hover:bg-red-600 hover:text-white transition">
                  Réinitialiser le mot de passe
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-4">
                  <Input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <DialogFooter className="mt-4">
                  <Button onClick={handlePasswordReset} variant="outline"
  className="w-full rounded-full border-2 border-red-600 text-red-600 font-semibold hover:bg-red-600 hover:text-white transition"
>Reset Password</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
