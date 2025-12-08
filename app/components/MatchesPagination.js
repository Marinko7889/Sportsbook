"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "../context/LocaleContext";
import { t } from "../lib/i18n";
export default function MatchesPagination({ page, totalDays, day }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const changePage = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white shadow rounded-xl text-center space-y-2">
      <div className="flex justify-between">
        <button
          onClick={() => changePage(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-4 py-2 bg-blue-300 rounded disabled:opacity-50"
        >
          {t("Previous", locale)}
        </button>

        <button
          onClick={() => changePage(Math.min(totalDays, page + 1))}
          disabled={page >= totalDays}
          className="px-4 py-2 bg-blue-300 rounded disabled:opacity-50"
        >
          {t("Next", locale)}
        </button>
      </div>
    </div>
  );
}
