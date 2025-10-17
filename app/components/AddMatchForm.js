"use client";
import toast, { Toaster } from "react-hot-toast";
import { useLocale } from "../context/LocaleContext";
import { t } from "..//lib/i18n";
export default function AddMatchForm({
  teams,
  homeTeamId,
  setHomeTeamId,
  awayTeamId,
  setAwayTeamId,
  date,
  setDate,
  addMatch,
}) {
  const { locale } = useLocale();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!homeTeamId || !awayTeamId || !date) {
      toast.error("Please select both teams and a date!");
      return;
    }

    addMatch(e);
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 flex-wrap items-center mt-4"
      >
        <select
          value={homeTeamId}
          onChange={(e) => setHomeTeamId(e.target.value)}
          className="border p-1 rounded"
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
          className="border p-1 rounded"
        >
          <option value="">{t("Away Team", locale)}</option>
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
          {t("Add Match", locale)}
        </button>
      </form>
      <Toaster position="top-center" />
    </>
  );
}
