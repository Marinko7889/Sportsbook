"use client";
import { useState } from "react";
import { deleteCompetition, updateCompetition } from "../actions/competitions";
import toast from "react-hot-toast";
import { t } from "../lib/i18n";
import { useLocale } from "../context/LocaleContext";
export default function CompetitionHeader({ competition, children }) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(competition.name);
  const [selected, setSelected] = useState(false);
  const { locale } = useLocale();
  const handleUpdate = async (e) => {
    e.preventDefault();
    const result = await updateCompetition({
      id: competition.id,
      name: newName,
      rowVersion: competition.rowVersion,
    });

    if (!result.ok) {
      if (result.status === 409) {
        toast.error(t("Update failed. Conflict:", locale) + result.message);
      } else {
        toast.error(t("Update failed", locale) + result.message);
      }
      return;
    }

    toast.success(t("Competition updated!", locale));
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteCompetition(competition.id);
    toast.success(t("Competition deleted!", locale));
  };

  return (
    <div className="flex flex-col gap-2">
      {editing ? (
        <form className="flex gap-2 items-center" onSubmit={handleUpdate}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border p-1 rounded flex-1"
          />
          <button
            type="submit"
            className="bg-yellow-500 px-2 rounded text-white"
          >
            {t("Save", locale)}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="bg-gray-500 px-2 rounded text-white"
          >
            {t("Cancel", locale)}
          </button>
        </form>
      ) : (
        <div className="flex justify-between items-center">
          <button
            onClick={() => setSelected(!selected)}
            className="flex-1 text-left font-semibold hover:underline"
          >
            {competition.name}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="bg-green-500 px-2 rounded text-white"
            >
              {t("Edit", locale)}
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              {t("Delete", locale)}
            </button>
          </div>
        </div>
      )}

      {selected && <div className="mt-2 pl-4">{children}</div>}
    </div>
  );
}
