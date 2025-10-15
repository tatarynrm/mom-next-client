import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainProvider from "@/providers/MainProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Записник логіста",
  description: "Записник створений для ФОП",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // wotdisconnected="true"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}
