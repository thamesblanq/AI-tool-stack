"use client";

import { usePathname } from "next/navigation";

export default function NavWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define routes where the Navbar should be hidden
  const authRoutes = ["/login", "/signup"];

  if (authRoutes.includes(pathname)) {
    return null; // Don't render the Navbar on these routes
  }

  return <>{children}</>;
}