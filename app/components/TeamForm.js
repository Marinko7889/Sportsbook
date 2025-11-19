"use client";
import { addTeam } from "../actions/teams";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { t } from "../lib/i18n";
import { useLocale } from "../context/LocaleContext";
export default function TeamForm() {
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const { locale } = useLocale();
  const handleSubmit = (e) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await addTeam(name);
        setName("");
        toast.success(t("Team successfully added", locale));
      } catch (error) {
        console.error("Error adding team:", error);
        toast.error(t("Error adding team", locale));
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-6 p-4 bg-white rounded-xl shadow-md flex gap-2"
    >
      <input
        type="text"
        name="name"
        placeholder={t("Team name", locale)}
        className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        type="submit"
        disabled={isPending}
        className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition"
      >
        {isPending ? t("Adding...", locale) : t("Add team", locale)}
      </button>
    </form>
  );
}
