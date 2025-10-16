// "use client";

// import { useState, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import CompetitionsPage from "../competition/page";
// import TeamsPage from "../teams/page";
// import { usePathname } from "next/navigation";

// export default function PageWrapper({ children }) {
//   const [active, setActive] = useState("competitions");
//   const pathname = usePathname();

//   useEffect(() => {
//     // Hook uvijek pozvan, ali logika unutar njega ovisi o pathname
//     if (pathname.includes("teams")) setActive("teams");
//     else if (pathname.includes("competitions")) setActive("competitions");
//   }, [pathname]);

//   // Ako smo na login, samo render children
//   if (pathname === "/login" || pathname === "/register") return <>{children}</>;

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar active={active} setActive={setActive} />

//       <main className="flex-1 p-8">
//         {active === "competitions" && <CompetitionsPage />}
//         {active === "teams" && <TeamsPage />}
//       </main>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import CompetitionsPage from "../competition/page";
import TeamsPage from "../teams/page";
import { getToken } from "../lib/auth";
import Spinner from "./Spinner";

export default function PageWrapper() {
  const [active, setActive] = useState("competitions");
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (pathname.includes("teams")) setActive("teams");
    else if (pathname.includes("competitions")) setActive("competitions");
  }, [pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar active={active} setActive={setActive} />
      <main className="flex-1 p-8">
        {active === "competitions" && <CompetitionsPage />}
        {active === "teams" && <TeamsPage />}
      </main>
    </div>
  );
}
