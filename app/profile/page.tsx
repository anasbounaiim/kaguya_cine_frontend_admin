import AdminLayout from "@/components/ui/AdminLayout";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <AdminLayout>
    <div className="min-h-[60vh] flex items-center justify-center bg-transparent">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col items-center">
          <Image
            src="https://assets.aceternity.com/manu.png"
            alt="Avatar"
            width={90}
            height={90}
            className="rounded-full border-4 border-red-600 shadow mb-4"
          />
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Manu Arora
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            manu@example.com
          </p>
          {/* More details */}
          <div className="w-full space-y-4 mt-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                Rôle
              </span>
              <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 rounded-full text-xs">
                Admin
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
            <button
              className="w-full px-5 py-2 bg-red-600 text-white rounded-full font-semibold shadow hover:bg-red-700 transition"
              // onClick={() => { ... }}
            >
              Modifier le profil
            </button>
            <button
              className="w-full px-5 py-2 bg-transparent border-2 border-red-600 text-red-600 rounded-full font-semibold hover:bg-red-600 hover:text-white transition"
              // onClick={() => { ... }}
            >
              Réinitialiser le mot de passe
            </button>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}
