"use client";

import { useState } from "react";
import CompetitionItem from "./CompetitionItem";
import { t } from "../lib/i18n";
import { useLocale } from "../context/LocaleContext";
export default function CompetitionSearch({ competitions }) {
  const [search, setSearch] = useState("");
  const { locale } = useLocale();
  const filteredCompetitions = competitions.filter((comp) =>
    comp.name.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-sm md:max-w-2xl mx-auto px-2">
      <div className="mb-6">
        <input
          type="text"
          placeholder={t("Search competitions...", locale)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {search && (
        <p className="text-sm text-gray-600 mb-4 text-center md:text-left">
          {t("Showing", locale)} {filteredCompetitions.length} {t("of", locale)}{" "}
          {competitions.length} {t("Competitions", locale)}
        </p>
      )}

      <ul className="space-y-2">
        {filteredCompetitions.map((competition) => (
          <CompetitionItem key={competition.id} competition={competition} />
        ))}
      </ul>

      {filteredCompetitions.length === 0 && search && (
        <p className="text-center text-gray-500 py-8">
          {t("No competitions found", locale)}
        </p>
      )}
    </div>
  );
}
