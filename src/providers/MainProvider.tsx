import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "sonner";
import { AuthProvider } from "./AuthProvider";
const MainProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      themes={["light", "dark", "theme-blue", "theme-green", "theme-red"]}
      storageKey="logistic-mira-theme"
    >
      <AuthProvider>{children}</AuthProvider>

      <Toaster richColors position="bottom-right" />
    </ThemeProvider>
  );
};

export default MainProvider;
