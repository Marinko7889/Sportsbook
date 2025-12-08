"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "../context/LocaleContext";
import { t } from "../lib/i18n";
export default function TeamFilter({ competitions }) {
  const router = useRouter();
  const [selectedCompetition, setSelectedCompetition] = useState("");
  const { locale } = useLocale();
  const handleCompetitionChange = (e) => {
    const newComp = e.target.value;
    setSelectedCompetition(newComp);
    router.push(`/teams?page=1&selectedCompetition=${newComp}`);
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded-xl shadow-md">
      <select
        value={selectedCompetition}
        onChange={handleCompetitionChange}
        className="mb-4 p-2 border rounded w-full"
      >
        <option value="">{t("All competitions", locale)}</option>
        {competitions.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
