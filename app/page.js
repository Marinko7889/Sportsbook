"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TeamsPage from "./teams/page";
import CompetitionsPage from "./competition/page";

export default function HomePage() {
  //const [active, setActive] = useState("competitions");

  return (
    <div className="flex min-h-screen">
      {/* <Sidebar active={active} setActive={setActive} /> */}

      <div className="flex-1 p-8">
        {/* {active === "competitions" && <CompetitionsPage />}
        {active === "teams" && <TeamsPage />} */}
      </div>
    </div>
  );
}
