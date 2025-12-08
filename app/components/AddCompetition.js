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
      // toast.error(t("Failed to add competition", locale));
      toast.error(err.message || t("Error adding competition", locale));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">
        {t("Competitions", locale)}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2 mb-4 md:flex-row md:gap-4 w-full"
      >
        <input
          type="text"
          placeholder={t("Competition name", locale)}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full  p-2 rounded md:flex-1 "
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full max-w-xs md:w-auto"
        >
          {t("Add", locale)}
        </button>
      </form>
    </div>
  );
}
