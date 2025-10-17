"use client";
import { useState } from "react";
import { useLocale } from "../context/LocaleContext";
import { t } from "..//lib/i18n";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export default function TeamForm({ onAdd }) {
  const [name, setName] = useState("");
  const { locale } = useLocale();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    await onAdd({ name });
    setName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-6 p-4 bg-white rounded-xl shadow-md flex gap-2"
    >
      <input
        type="text"
        placeholder={t("Team name", locale)}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {t("Add team", locale)}
      </button>
    </form>
  );
}
