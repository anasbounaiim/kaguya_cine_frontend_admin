import AuthGuard from "@/components/Auth/AuthGuard";
import AdminHome from "../components/adminHome";

export default function Home() {
  return (
    <div>
      <AuthGuard>
        <AdminHome />
      </AuthGuard>
    </div>
  );
}
