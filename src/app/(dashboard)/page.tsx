"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import VendorDashboard from "@/components/dashboard/VendorDashboard";

export default function DashboardPage() {
  const currentUser = useAppSelector(selectCurrentUser);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }
    setLoading(false);
  }, [currentUser, router]);

  if (!currentUser) {
    router.push("/auth/login");
    return null;
  }

  if (loading) return <div>Loading...</div>;

  if (currentUser?.role === "admin") return <AdminDashboard />;
  if (currentUser?.role === "vendor") return <VendorDashboard />;
  // Default to admin dashboard if role is undefined
  return <AdminDashboard />;
}
