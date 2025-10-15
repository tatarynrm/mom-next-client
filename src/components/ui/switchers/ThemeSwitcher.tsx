"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // щоб уникнути проблем з SSR
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {currentTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
