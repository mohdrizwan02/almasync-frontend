import Navbar from "@/components/Navbar";
import "./globals.css";

import { Suspense } from "react";

import ScrollProgress from "@/components/Scroll-Progress";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Navbar />

        <Suspense fallback={null}>
          <ScrollProgress />
          <div className="mt-16">{children}</div>
        </Suspense>
      </body>
    </html>
  );
}
