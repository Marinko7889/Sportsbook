"use client";
import { useTransition } from "react";
import { deleteMatch } from "../actions/matches";
import toast from "react-hot-toast";
import { t } from "../lib/i18n";
import { useLocale } from "../context/LocaleContext";

export default function MatchItem({ match }) {
  const [pending, startTransition] = useTransition();
  const { locale } = useLocale();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteMatch(match.matchId);

      if (result.ok) {
        toast.success(t("Match deleted successfully!", locale));
      } else {
        toast.error(result.error || t("Failed to delete match", locale));
      }
    });
  };

  const matchDateObj = new Date(match.date);
  const matchDate = matchDateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const matchTime = matchDateObj.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  // console.log(match);
  return (
    <li className="flex justify-between items-center bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow duration-150">
      <div className="flex-1">
        <div className="font-semibold text-gray-800">
          {match.homeTeam} vs {match.awayTeam}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {matchDate} {matchTime}
        </div>
      </div>

      <button
        disabled={pending}
        onClick={handleDelete}
        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-red-300 ml-4 transition-colors"
      >
        {pending ? t("Deleting...", locale) : t("Delete", locale)}
      </button>
    </li>
  );
}
