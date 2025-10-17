"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import CompetitionsPage from "../competition/page";
import TeamsPage from "../teams/page";
import { getToken } from "../lib/auth";
import Spinner from "./Spinner";
import { QueryClientProvider } from "@tanstack/react-query";
import { useQueryClient, QueryClient } from "@tanstack/react-query";
import VjezbaPage from "../vjezba/page";
import { useSearchParams } from "next/navigation";
const queryClient = new QueryClient();

export default function PageWrapper() {
  const [active, setActive] = useState("competitions");
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "teams" || tab === "competitions" || tab === "vjezba") {
      setActive(tab);
    }
  }, [searchParams]);

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen">
        <Sidebar active={active} setActive={setActive} />
        {/* <main className="flex-1 p-8">
        {active === "competitions" && <CompetitionsPage />}
        {active === "teams" && <TeamsPage />}
      </main> */}
        <main className="flex-1 p-8">
          {active === "competitions" && <CompetitionsPage />}
          {active === "teams" && <TeamsPage />}
          {active === "vjezba" && <VjezbaPage />}
        </main>
      </div>
    </QueryClientProvider>
  );
}
