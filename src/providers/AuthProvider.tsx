// context/AuthProvider.tsx
"use client";
import { useAuth } from "@/shared/hooks/useAuth";
import { createContext, useContext, ReactNode } from "react";

const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used inside AuthProvider");
  return context;
};
