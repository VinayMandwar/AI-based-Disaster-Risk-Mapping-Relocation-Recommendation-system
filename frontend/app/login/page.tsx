"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  UserCheck,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  User as UserIcon,
  MapPin,
  ArrowRight,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { AashrayLogo } from "@/components/ui/AashrayLogo";
import { useAuth } from "@/context/AuthContext";
import { RAW_DEMO_HABITATIONS } from "@/lib/demoData";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAsAdmin, loginAsUser, setUserProfile } = useAuth();

  // Active Role Tab: 'admin' | 'user'
  const initialRole = searchParams.get("role") === "user" ? "user" : "admin";
  const [activeTab, setActiveTab] = useState<"admin" | "user">(initialRole);

  // Citizen sub-tab: 'login' | 'register'
  const [userMode, setUserMode] = useState<"login" | "register">("login");

  // Admin form state
  const [adminIdentifier, setAdminIdentifier] = useState("admin@aashray.gov.in");
  const [adminPassword, setAdminPassword] = useState("••••••••••••");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // User form state
  const [userIdentifier, setUserIdentifier] = useState("citizen.rampur@aashray.local");
  const [userPassword, setUserPassword] = useState("••••••••••••");
  const [showUserPassword, setShowUserPassword] = useState(false);

  // Registration form state
  const [regName, setRegName] = useState("");
  const [regContact, setRegContact] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regHabitationId, setRegHabitationId] = useState(RAW_DEMO_HABITATIONS[0].id);

  // Feedback states
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "user") {
      setActiveTab("user");
    } else if (roleParam === "admin") {
      setActiveTab("admin");
    }
  }, [searchParams]);

  // Admin Submit
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminIdentifier.trim() || !adminPassword.trim()) {
      setError("Please provide both email/username and password.");
      return;
    }
    setError(null);
    loginAsAdmin();
    router.push("/dashboard");
  };

  // User Submit
  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdentifier.trim() || !userPassword.trim()) {
      setError("Please enter your registered email or mobile number.");
      return;
    }
    setError(null);
    loginAsUser(RAW_DEMO_HABITATIONS[0].id);
    router.push("/user-dashboard");
  };

  // User Registration
  const handleUserRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regContact.trim() || !regPassword.trim()) {
      setError("Please complete all required fields to register.");
      return;
    }
    setError(null);
    const hab = RAW_DEMO_HABITATIONS.find((h) => h.id === regHabitationId) || RAW_DEMO_HABITATIONS[0];
    setUserProfile({
      id: `reg-${Date.now()}`,
      email: regContact.includes("@") ? regContact : `${regContact}@citizen.aashray.local`,
      full_name: regName,
      mobile: regContact.includes("@") ? undefined : regContact,
      role_name: "USER",
      habitation_id: hab.id,
      habitation_name: hab.name,
      village: hab.village,
      district: hab.district,
      state: hab.state,
      is_active: true,
    });
    router.push("/user-dashboard");
  };

  // Fast Demo Access
  const handleDemoAdmin = () => {
    loginAsAdmin();
    router.push("/dashboard");
  };

  const handleDemoCitizen = () => {
    loginAsUser(RAW_DEMO_HABITATIONS[0].id);
    router.push("/user-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/70 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>

        <AashrayLogo size="sm" light={true} showSubtitle={false} />
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header & Logo */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">AASHRAY PORTAL</h1>
            <p className="text-xs text-slate-400">
              AI-Based Disaster Risk Mapping & Relocation Recommendation System
            </p>
          </div>

          {/* Role Navigation Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab("admin");
                setError(null);
                setMessage(null);
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-colors ${
                activeTab === "admin"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ADMIN</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("user");
                setError(null);
                setMessage(null);
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-colors ${
                activeTab === "user"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>USER</span>
            </button>
          </div>

          {/* Error / Notice Display */}
          {error && (
            <div className="p-3 bg-rose-950/70 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-lg text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* ADMIN LOGIN FORM */}
          {activeTab === "admin" && (
            <form className="space-y-4" onSubmit={handleAdminLogin}>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Email / Username
                </label>
                <div className="mt-1 relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={adminIdentifier}
                    onChange={(e) => setAdminIdentifier(e.target.value)}
                    placeholder="admin@aashray.gov.in"
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMessage("Password reset instructions have been logged for this demo session.")}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="mt-1 relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showAdminPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter security password"
                    className="block w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-md shadow-emerald-950/40"
              >
                <span>Login as Administrator</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Development / Demo Mode Mechanism */}
              <div className="pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={handleDemoAdmin}
                  className="w-full py-2 px-3 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DEMO MODE — Fast Admin Access</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-1.5">
                  Safe demo environment. No real credentials stored.
                </p>
              </div>
            </form>
          )}

          {/* USER (CITIZEN) INTERFACE */}
          {activeTab === "user" && (
            <div className="space-y-4">
              {/* Login / Register Toggle */}
              <div className="flex border-b border-slate-700 pb-2 space-x-4 text-xs font-bold">
                <button
                  onClick={() => setUserMode("login")}
                  className={`pb-1 border-b-2 transition-colors ${
                    userMode === "login"
                      ? "border-teal-400 text-teal-300"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Citizen Login
                </button>
                <button
                  onClick={() => setUserMode("register")}
                  className={`pb-1 border-b-2 transition-colors ${
                    userMode === "register"
                      ? "border-teal-400 text-teal-300"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Create Account (Register)
                </button>
              </div>

              {/* Citizen Login */}
              {userMode === "login" && (
                <form className="space-y-4" onSubmit={handleUserLogin}>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Email / Mobile
                    </label>
                    <div className="mt-1 relative rounded-lg">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={userIdentifier}
                        onChange={(e) => setUserIdentifier(e.target.value)}
                        placeholder="citizen@aashray.local or +91 98765 43210"
                        className="block w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setMessage("Password reset instructions have been dispatched.")}
                        className="text-[11px] text-teal-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="mt-1 relative rounded-lg">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showUserPassword ? "text" : "password"}
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="block w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowUserPassword(!showUserPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                      >
                        {showUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-md shadow-teal-950/40"
                  >
                    <span>Login to Citizen Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Fast Citizen Demo Access */}
                  <div className="pt-3 border-t border-slate-700/60">
                    <button
                      type="button"
                      onClick={handleDemoCitizen}
                      className="w-full py-2 px-3 bg-teal-950/60 hover:bg-teal-900/60 border border-teal-700/60 text-teal-300 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>DEMO MODE — Fast Citizen Access (Rampur Area)</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Citizen Registration */}
              {userMode === "register" && (
                <form className="space-y-3" onSubmit={handleUserRegister}>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Full Name
                    </label>
                    <div className="mt-1 relative rounded-lg">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Email or Mobile
                    </label>
                    <div className="mt-1 relative rounded-lg">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={regContact}
                        onChange={(e) => setRegContact(e.target.value)}
                        placeholder="e.g. +91 98765 43210 or user@domain.com"
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Location / Habitation
                    </label>
                    <div className="mt-1 relative rounded-lg">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <select
                        value={regHabitationId}
                        onChange={(e) => setRegHabitationId(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        {RAW_DEMO_HABITATIONS.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name} ({h.village}, {h.district})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="mt-1 relative rounded-lg">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
          Loading portal access...
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
