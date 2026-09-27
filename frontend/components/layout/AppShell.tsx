"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ShieldAlert } from "lucide-react";

const ADMIN_ONLY_ROUTES = [
  "/dashboard",
  "/habitations",
  "/capacity",
  "/relocation",
  "/reports",
  "/settings",
];

const InnerShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useAuth();

  const isLandingPage = pathname === "/";
  const isAuthPage = pathname === "/login";

  // Check if current route is admin-only and active role is USER
  const isAdminOnly = ADMIN_ONLY_ROUTES.some(
    (route) => pathname === route || (route !== "/dashboard" && pathname.startsWith(route))
  );
  const isRestrictedForUser = role === "USER" && isAdminOnly;

  useEffect(() => {
    if (isRestrictedForUser) {
      router.replace("/user-dashboard");
    }
  }, [isRestrictedForUser, router]);

  if (isLandingPage || isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {children}
      </div>
    );
  }

  if (isRestrictedForUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-700 text-rose-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold">Administrative Clearance Required</h2>
          <p className="text-xs text-slate-400">
            This module is restricted to authorized disaster-management personnel. Redirecting to your Citizen Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <InnerShell>{children}</InnerShell>
      </AuthProvider>
    </LanguageProvider>
  );
};
