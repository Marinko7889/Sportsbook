"use client";

import { useState, useEffect } from "react";
import TeamList from "../components/TeamList";
import TeamForm from "../components/TeamForm";
import CompetitionSelect from "../components/CompetitionSelect";
import Sidebar from "../components/Sidebar";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);

  const fetchTeams = async () => {
    try {
      const res = await fetch("http://localhost:5072/api/teams");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const addTeam = async (team) => {
    await fetch("http://localhost:5072/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(team),
    });
    fetchTeams();
  };

  const deleteTeam = async (id) => {
    await fetch(`http://localhost:5072/api/teams/${id}`, { method: "DELETE" });
    fetchTeams();
  };

  return (
    <div>
      <h1 className="text-center">Sportsbook</h1>
      <TeamForm onAdd={addTeam} />
      <TeamList teams={teams} onDelete={deleteTeam} />
      {/* <CompetitionSelect /> */}
    </div>
  );
}
