"use client";
import { useRouter } from "next/navigation";
import { useLocale } from "../context/LocaleContext";
import { t } from "../lib/i18n";
export default function Pagination({ page, totalPages, selectedCompetition }) {
  const router = useRouter();
  const { locale } = useLocale();
  const handlePageChange = (newPage) => {
    router.push(
      `/teams?page=${newPage}&selectedCompetition=${selectedCompetition || ""}`
    );
  };

  return (
    <div className="max-w-md mx-auto mt-4 flex justify-between items-center p-4 bg-white rounded-xl shadow-md">
      <button
        onClick={() => handlePageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-4 py-2 bg-blue-300 rounded disabled:opacity-50"
      >
        {t("Previous", locale)}
      </button>

      <span>
        {t("Page", locale)} {page} / {totalPages}
      </span>

      <button
        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-4 py-2 bg-blue-300 rounded disabled:opacity-50"
      >
        {t("Next", locale)}
      </button>
    </div>
  );
}
