"use client";

import { useState } from "react";
import { addCompetition } from "../actions/competitions";
import toast from "react-hot-toast";
import { t } from "../lib/i18n";
import { useLocale } from "../context/LocaleContext";
export default function AddCompetitionForm() {
  const [name, setName] = useState("");
  const { locale } = useLocale();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addCompetition(name);
      toast.success(t("Competition added", locale));
      setName("");
    } catch (err) {
      toast.error(t("Failed to add competition", locale));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder={t("Competition name", locale)}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded flex-1"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {t("Add", locale)}
      </button>
    </form>
  );
}
