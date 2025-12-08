"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "../context/LocaleContext";
import { t } from "../lib/i18n";

export default function TeamSearchBar({ searchFunction }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();
  const { locale } = useLocale();

  const debounceRef = useRef(null);

  const handleInput = useCallback(
    (value) => {
      setQuery(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        if (value.length < 2) {
          setResults([]);
          return;
        }

        const data = await searchFunction(value);
        setResults(data);
      }, 500);
    },
    [searchFunction]
  );

  const handleTeamClick = (teamId) => {
    router.push(`/teams/${teamId}`);
  };

  return (
    <div className="relative w-full mb-4 mt-8 md:max-w-xl mx-auto">
      <input
        className="border p-2 rounded w-full"
        placeholder={t("Search teams...", locale)}
        value={query}
        onChange={(e) => handleInput(e.target.value)}
      />

      {results.length > 0 && (
        <ul className="absolute w-full bg-white border shadow rounded mt-1 z-50 text-black">
          {results.map((team) => (
            <li
              key={team.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleTeamClick(team.id)}
            >
              {team.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
