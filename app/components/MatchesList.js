"use client";

import { useState } from "react";
import Spinner from "./Spinner";
import { useLocale } from "../context/LocaleContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { t } from "../lib/i18n";
export default function MatchesList({ competition }) {
  const { locale } = useLocale();
  const queryClient = useQueryClient();

  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [date, setDate] = useState("");

  const fetchTeams = async () => {
    const res = await fetch("http://localhost:5072/api/teams");
    if (!res.ok) throw new Error("Failed to fetch teams");
    return res.json();
  };

  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    staleTime: 1000 * 60 * 5,
  });

  const fetchMatches = async () => {
    const res = await fetch("http://localhost:5072/api/matches");
    if (!res.ok) throw new Error("Failed to fetch matches");
    const data = await res.json();
    const filtered = data.filter(
      (m) => m.competition.toLowerCase() === competition.name.toLowerCase()
    );
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    return filtered;
  };

  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ["matches", competition.id],
    queryFn: fetchMatches,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const addMatchMutation = useMutation({
    mutationFn: async (newMatch) => {
      const res = await fetch("http://localhost:5072/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMatch),
      });
      if (!res.ok) throw new Error("Failed to add match");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches", competition.id] });
      setHomeTeamId("");
      setAwayTeamId("");
      setDate("");
    },
  });

  const deleteMatchMutation = useMutation({
    mutationFn: (id) =>
      fetch(`http://localhost:5072/api/matches/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches", competition.id] });
    },
  });

  const handleAddMatch = (e) => {
    e.preventDefault();
    if (!homeTeamId || !awayTeamId || !date) return;

    addMatchMutation.mutate({
      homeTeamId: Number(homeTeamId),
      awayTeamId: Number(awayTeamId),
      competitionId: Number(competition.id),
      date,
    });
  };

  if (teamsLoading || matchesLoading) return <Spinner />;

  const groupedMatches = matches.reduce((acc, match) => {
    const dateKey = new Date(match.date).toLocaleDateString(locale);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {});

  return (
    <div className="mt-4">
      <form onSubmit={handleAddMatch} className="flex gap-2 mb-4">
        <select
          value={homeTeamId}
          onChange={(e) => setHomeTeamId(e.target.value)}
          className="border p-1 rounded flex-1"
        >
          <option value="">{t("Home Team", locale)}</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          value={awayTeamId}
          onChange={(e) => setAwayTeamId(e.target.value)}
          className="border p-1 rounded flex-1"
        >
          <option value="">{t("Away Team", locale)}</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-1 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-2 rounded hover:bg-blue-700"
        >
          {t("Add match", locale)}
        </button>
      </form>

      {Object.keys(groupedMatches).length === 0 && (
        <p>{t("No matches yet.", locale)}</p>
      )}

      {Object.entries(groupedMatches).map(([date, matchesOnDate]) => (
        <div key={date} className="mb-4">
          <h4 className="font-semibold">{date}</h4>
          <ul>
            {matchesOnDate.map((m) => (
              <li
                key={m.matchId}
                className="flex justify-between items-center border-b py-1"
              >
                <span>{`${m.homeTeam} vs ${m.awayTeam}`}</span>
                <button
                  type="button"
                  onClick={() => deleteMatchMutation.mutate(m.matchId)}
                  className="text-red-600 hover:text-red-800 px-2"
                >
                  {t("Delete", locale)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
