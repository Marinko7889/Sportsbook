"use client";

import { useState, useEffect } from "react";
import AddMatchForm from "./AddMatchForm";
import { useLocale } from "../context/LocaleContext";
import { t } from "../lib/i18n";
export default function MatchesList({ competition }) {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [date, setDate] = useState("");
  const { locale } = useLocale();

  const fetchTeams = async () => {
    const res = await fetch("http://localhost:5072/api/teams");
    const data = await res.json();
    setTeams(data);
  };

  const fetchMatches = async () => {
    const res = await fetch("http://localhost:5072/api/matches");
    const data = await res.json();

    const filtered = data.filter(
      (m) => m.competition.toLowerCase() === competition.name.toLowerCase()
    );

    // Sortiraj po datumu
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    setMatches(filtered);
  };

  useEffect(() => {
    fetchTeams();
    fetchMatches();
  }, [competition]);

  // --- Dodaj utakmicu ---
  const addMatch = async (e) => {
    e.preventDefault();
    if (!homeTeamId || !awayTeamId || !date) return;

    const res = await fetch("http://localhost:5072/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        homeTeamId: Number(homeTeamId),
        awayTeamId: Number(awayTeamId),
        competitionId: Number(competition.id),
        date,
      }),
    });

    const newMatch = await res.json();

    setMatches((prev) => [
      ...prev,
      {
        matchId: newMatch.id,
        homeTeam: newMatch.homeTeam?.name || newMatch.homeTeam,
        awayTeam: newMatch.awayTeam?.name || newMatch.awayTeam,
        competition: newMatch.competition?.name || competition.name,
        date: newMatch.date,
      },
    ]);

    setHomeTeamId("");
    setAwayTeamId("");
    setDate("");
  };

  // --- Obriši utakmicu ---
  const deleteMatch = async (id) => {
    await fetch(`http://localhost:5072/api/matches/${id}`, {
      method: "DELETE",
    });
    setMatches((prev) => prev.filter((m) => m.matchId !== id));
  };

  // --- Grupiranje po datumu ---
  const groupedMatches = matches.reduce((acc, match) => {
    const dateKey = new Date(match.date).toLocaleDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {});

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">
        {t("Matches for", locale)} {competition.name}
      </h3>

      {matches.length === 0 && <p>{t("No matches yet.", locale)}</p>}

      {/* Lista utakmica grupirana po datumu */}
      {Object.entries(groupedMatches).map(([date, dayMatches]) => (
        <div key={date} className="mb-4">
          <h4 className="font-semibold mb-2">{date}</h4>
          <ul className="space-y-2 mb-4 bg-gray-50 rounded-md shadow-inner p-2">
            {dayMatches.map((m) => (
              <li
                key={m.matchId ?? m.id}
                className="flex justify-between items-center border-b border-gray-300 py-2 px-3 hover:bg-gray-100 transition-colors duration-150 rounded"
              >
                <span className="text-gray-800 font-medium">
                  {m.homeTeam} vs {m.awayTeam} –{" "}
                  {new Date(m.date).toLocaleTimeString()}
                </span>
                <div className="flex gap-2">
                  <button className="text-green-600 hover:text-green-800 font-semibold px-2 py-1 rounded hover:bg-green-100 transition-colors duration-150">
                    {t("Edit", locale)}
                  </button>
                  <button
                    onClick={() => deleteMatch(m.matchId || m.id)}
                    className="text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded hover:bg-red-100 transition-colors duration-150"
                  >
                    {t("Delete", locale)}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <AddMatchForm
        teams={teams}
        homeTeamId={homeTeamId}
        setHomeTeamId={setHomeTeamId}
        awayTeamId={awayTeamId}
        setAwayTeamId={setAwayTeamId}
        date={date}
        setDate={setDate}
        addMatch={addMatch}
      />
      {/* <form
        onSubmit={addMatch}
        className="flex gap-2 flex-wrap items-center mt-4"
      >
        <select
          value={homeTeamId}
          onChange={(e) => setHomeTeamId(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">Home Team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          value={awayTeamId}
          onChange={(e) => setAwayTeamId(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">Away Team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-1 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          ➕ Add Match
        </button>
      </form> */}
    </div>
  );
}
