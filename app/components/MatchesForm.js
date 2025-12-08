"use client";
import { useTransition } from "react";
import { addMatch } from "../actions/matches";
import toast from "react-hot-toast";
import { t } from "../lib/i18n";
import { useLocale } from "../context/LocaleContext";

export default function MatchesForm({ teams, competitionId }) {
  const [pending, startTransition] = useTransition();
  const { locale } = useLocale();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const homeTeamId = Number(formData.get("homeTeam"));
    const awayTeamId = Number(formData.get("awayTeam"));
    const date = formData.get("date");

    if (homeTeamId === awayTeamId) {
      toast.error(t("Home and away teams cannot be the same", locale));
      return;
    }

    if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
      toast.error(t("Match date cannot be in the past", locale));
      return;
    }

    startTransition(async () => {
      const result = await addMatch({
        homeTeamId,
        awayTeamId,
        competitionId,
        date,
      });

      if (result.ok) {
        toast.success(t("Match added successfully!", locale));
        form.reset();
      } else {
        toast.error(result.error || t("Failed to add match", locale));
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 md:flex-row md:justify-center md:items-end flex-wrap"
    >
      <div className="flex flex-col min-w-[100px] flex-1">
        <h3 className="font-semibold mb-3 md:mb-0">
          {t("Add New Match", locale)}
        </h3>

        <label className="block text-sm font-medium mb-1">
          {t("Home Team", locale)}
        </label>
        <select
          name="homeTeam"
          required
          className="max-w-full  border p-2 rounded box-border"
          disabled={pending}
        >
          <option value="">{t("Select home team", locale)}</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col min-w-[150px] flex-1">
        <label className="block text-sm font-medium mb-1">
          {t("Away Team", locale)}
        </label>
        <select
          name="awayTeam"
          required
          className="w-full border p-2 rounded box-border"
          disabled={pending}
        >
          <option value="">{t("Select away team", locale)}</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col min-w-[150px] flex-1 md:mt-0">
        <label className="block text-sm font-medium mb-1">
          {t("Match Date", locale)}
        </label>
        <input
          type="datetime-local"
          name="date"
          required
          className="w-full border p-2 rounded"
          disabled={pending}
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>

      <div className="flex flex-col min-w-[120px] md:ml-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {pending ? t("Adding...", locale) : t("Add Match", locale)}
        </button>
      </div>
    </form>
  );
}
