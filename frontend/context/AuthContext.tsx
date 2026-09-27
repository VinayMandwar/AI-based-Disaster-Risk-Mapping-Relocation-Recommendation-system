"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: UserProfile | null;
  role: "ADMIN" | "USER";
  isAuthenticated: boolean;
  selectedHabitationId: string;
  setSelectedHabitationId: (id: string) => void;
  loginAsAdmin: () => void;
  loginAsUser: (habitationId?: string) => void;
  setUserProfile: (profile: UserProfile) => void;
  logout: () => void;
  switchRole: (newRole: "ADMIN" | "USER") => void;
}

const DEFAULT_ADMIN: UserProfile = {
  id: "admin-01",
  email: "admin@aashray.gov.in",
  full_name: "Dr. S. K. Raman (Disaster Operations Chief)",
  role_name: "ADMIN",
  is_active: true,
};

const DEFAULT_CITIZEN: UserProfile = {
  id: "citizen-01",
  email: "citizen.rampur@aashray.local",
  full_name: "Ramesh Kumar (Resident)",
  mobile: "+91 98765 43210",
  role_name: "USER",
  habitation_id: "HAB-UK-CHM-01",
  habitation_name: "Nandi Gram Tola",
  village: "Nandikot",
  district: "Chamoli",
  state: "Uttarakhand",
  is_active: true,
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_ADMIN,
  role: "ADMIN",
  isAuthenticated: true,
  selectedHabitationId: "HAB-UK-CHM-01",
  setSelectedHabitationId: () => {},
  loginAsAdmin: () => {},
  loginAsUser: () => {},
  setUserProfile: () => {},
  logout: () => {},
  switchRole: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_ADMIN);
  const [role, setRole] = useState<"ADMIN" | "USER">("ADMIN");
  const [selectedHabitationId, setSelectedHabitationIdState] = useState<string>("HAB-UK-CHM-01");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("aashray_role") as "ADMIN" | "USER";
      const savedHab = localStorage.getItem("aashray_habitation_id");
      if (savedRole === "USER") {
        setRole("USER");
        setUser(DEFAULT_CITIZEN);
      } else {
        setRole("ADMIN");
        setUser(DEFAULT_ADMIN);
      }
      if (savedHab) {
        setSelectedHabitationIdState(savedHab);
      }
    }
  }, []);

  const loginAsAdmin = () => {
    setRole("ADMIN");
    setUser(DEFAULT_ADMIN);
    if (typeof window !== "undefined") {
      localStorage.setItem("aashray_role", "ADMIN");
    }
  };

  const loginAsUser = (habitationId?: string) => {
    setRole("USER");
    const citizenUser = {
      ...DEFAULT_CITIZEN,
      habitation_id: habitationId || selectedHabitationId || "HAB-UK-CHM-01",
    };
    setUser(citizenUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("aashray_role", "USER");
      if (habitationId) {
        localStorage.setItem("aashray_habitation_id", habitationId);
        setSelectedHabitationIdState(habitationId);
      }
    }
  };

  const setSelectedHabitationId = (id: string) => {
    setSelectedHabitationIdState(id);
    if (user && role === "USER") {
      setUser({ ...user, habitation_id: id });
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("aashray_habitation_id", id);
    }
  };

  const switchRole = (newRole: "ADMIN" | "USER") => {
    if (newRole === "ADMIN") {
      loginAsAdmin();
    } else {
      loginAsUser();
    }
  };

  const setUserProfile = (profile: UserProfile) => {
    setUser(profile);
    const resolvedRole = profile.role_name === "ADMIN" ? "ADMIN" : "USER";
    setRole(resolvedRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("aashray_role", resolvedRole);
      if (profile.habitation_id) {
        localStorage.setItem("aashray_habitation_id", profile.habitation_id);
        setSelectedHabitationIdState(profile.habitation_id);
      }
    }
  };

  const logout = () => {
    // Return to default demo state
    if (typeof window !== "undefined") {
      localStorage.removeItem("aashray_token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        selectedHabitationId,
        setSelectedHabitationId,
        loginAsAdmin,
        loginAsUser,
        setUserProfile,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
