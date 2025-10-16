"use client";
import { usePathname } from "next/navigation";
import PageWrapper from "./PageWrapper";

export default function ProtectedWrapper({ children }) {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }

  return <PageWrapper>{children}</PageWrapper>;
}
