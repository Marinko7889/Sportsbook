"use client";
import { useTransition, useState } from "react";
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

  const matchDate = new Date(match.date).toLocaleDateString();

  return (
    <li className="flex justify-between items-center border-b py-3 px-2 hover:bg-gray-50">
      <div className="flex-1">
        <div className="font-medium">
          {match.homeTeam} vs {match.awayTeam}
        </div>
        <div className="text-sm text-gray-500">{matchDate}</div>
      </div>

      <button
        disabled={pending}
        onClick={handleDelete}
        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-red-300 ml-4"
      >
        {pending ? t("Deleting...", locale) : t("Delete", locale)}
      </button>
    </li>
  );
}
