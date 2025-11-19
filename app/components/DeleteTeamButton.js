"use client";
import { useTransition } from "react";
import { deleteTeam } from "../actions/teams";
import toast from "react-hot-toast";
import { t } from "../lib/i18n";
import { useLocale } from "../context/LocaleContext";

export default function DeleteTeamButton({ teamId }) {
  const [isPending, startTransition] = useTransition();
  const { locale } = useLocale();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTeam({ id: teamId });
        toast.success(t("Team deleted", locale));
      } catch (error) {
        toast.error(t("Delete failed", locale));
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      {isPending ? t("Deleting...", locale) : t("Delete", locale)}
    </button>
  );
}
