"use client";

import { useState } from "react";
import {
  addTeamToCompetition,
  removeTeamFromCompetition,
} from "../actions/teams";
import Link from "next/link";
import toast from "react-hot-toast";
import { useLocale } from "../context/LocaleContext";
import { t } from "../lib/i18n";
export default function TeamCompetitions({ team, competitions }) {
  const [currentTeam, setCurrentTeam] = useState(team);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState("");
  const { locale } = useLocale();
  const availableCompetitions = competitions.filter(
    (comp) => !currentTeam.competitions?.some((tc) => tc.id === comp.id)
  );
  const handleAddCompetition = async () => {
    if (!selectedCompetition) return;
    setIsAdding(true);
    try {
      const result = await addTeamToCompetition(
        currentTeam.id,
        parseInt(selectedCompetition)
      );
      setCurrentTeam(result.team);
      setSelectedCompetition("");
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveCompetition = async (competitionId) => {
    try {
      const result = await removeTeamFromCompetition(
        currentTeam.id,
        competitionId
      );
      setCurrentTeam(result.team);
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md border">
      <h2 className="text-xl font-semibold mb-4">
        {t("Competitions", locale)}
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">
          {t("Current Competitions", locale)}
        </h3>
        {currentTeam.competitions && currentTeam.competitions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {currentTeam.competitions.map((competition) => (
              <div
                key={competition.id}
                className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm flex items-center gap-2"
              >
                {/* <span>{competition.name}</span>{" "} */}
                <Link href={`/competition/${competition.id}`}>
                  {competition.name}
                </Link>
                <button
                  onClick={() => handleRemoveCompetition(competition.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-bold"
                  title="Remove from competition"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            {t("This team is not in any competitions yet", locale)}
          </p>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-3">
          {t("Add to Competition", locale)}
        </h3>
        <div className="flex gap-2">
          <select
            value={selectedCompetition}
            onChange={(e) => setSelectedCompetition(e.target.value)}
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isAdding || availableCompetitions.length === 0}
          >
            <option value="">{t("Select competition...", locale)}</option>
            {availableCompetitions.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddCompetition}
            disabled={!selectedCompetition || isAdding}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isAdding ? t("Adding...", locale) : t("Add", locale)}{" "}
          </button>
        </div>

        {availableCompetitions.length === 0 && (
          <p className="text-gray-500 text-sm mt-2">
            {t("This team is already in all available competitions", locale)}
          </p>
        )}
      </div>
    </div>
  );
}
