"use client";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Toaster } from "sonner";


import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const navHiddenPaths = [
    "/login",
    "/register",
    "/admin/login",
    "/reset-password",
  ];

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`antialiased`}>
        <Navbar />
        <Toaster position="top-right" richColors closeButton />

        <div className={cn(!navHiddenPaths.includes(pathname) && "mt-16")}>
          {children}
        </div>
      </body>
    </html>
  );
}
