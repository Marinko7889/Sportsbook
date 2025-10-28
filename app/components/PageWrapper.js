"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import CompetitionsPage from "../competition/page";
import TeamsPage from "../teams/page";
import VjezbaPage from "../vjezba/page";
import { getToken } from "../lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Spinner from "./Spinner";
import Error from "./Error";

const queryClient = new QueryClient();

export default function PageWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [active, setActive] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token || token === "undefined" || token === "") {
      setIsAuthenticated(false);
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }

    setCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (pathname.includes("teams")) setActive("teams");
    else if (pathname.includes("vjezba")) setActive("vjezba");
    else if (pathname.includes("competition")) setActive("competitions");
    //else if (pathname.includes("hr")) setActive("competitions");
    //else if (pathname.includes("en")) setActive("competitions");
    else setActive("error");
  }, [pathname]);

  if (checkingAuth) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    router.push(`/login`);

    return null;
  }

  const handleActiveChange = (value) => {
    setActive(value);
    router.push(`/${value}`);
  };

  // let content;
  // if (active === "teams") content = <TeamsPage />;
  // else if (active === "vjezba") content = <VjezbaPage />;
  // else if (active === "competitions") content = <CompetitionsPage />;
  // else content = <Error />;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen">
        <Sidebar active={active} setActive={handleActiveChange} />
        <main className="flex-1 p-8 ml-64">{children}</main>
      </div>
    </QueryClientProvider>
  );
}
