"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // іконки для гамбургера
import ThemeSwitcher from "../ui/switchers/ThemeSwitcher";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Головна", href: "/dashboard" },
    { label: "Перевезення", href: "/dashboard/transportations" },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <div className="flex-shrink-0">
            <Link
              href="/dashboard"
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              ФОП Татарин М.В.
            </Link>
          </div>

          {/* Десктопна навігація */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ThemeSwitcher />
          {/* Мобільне меню */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-200 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобільне меню випадаюче */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <nav className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
