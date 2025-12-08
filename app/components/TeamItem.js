"use client";

import { useTransition } from "react";
import { deleteTeam } from "../actions/teams";
import toast from "react-hot-toast";
import { useLocale } from "../context/LocaleContext";
import { t } from "../lib/i18n";
import Link from "next/link";
export default function TeamItem({ team }) {
  const [isPending, startTransition] = useTransition();
  const { locale } = useLocale();
  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTeam({ id: team.id });
        toast.success(t("Team deleted", locale));
      } catch {
        toast.error(t("Delete failed", locale));
      }
    });
  };

  return (
    <li className="flex flex-col justify-between p-2 border rounded hover:bg-gray-50">
      <div className="flex justify-between items-center">
        <Link href={`teams/${team.id}`} className="font-semibold">
          {team.name}
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          {isPending ? t("Deleting...", locale) : t("Delete", locale)}
        </button>
      </div>
    </li>
  );
}
