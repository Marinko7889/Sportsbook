"use client";

import { useState } from "react";
import { deleteCompetition, updateCompetition } from "../actions/competitions";
import toast from "react-hot-toast";
import { t } from "../lib/i18n";
import { useLocale } from "../context/LocaleContext";
import CompetitionLink from "./CompetitionLink";
import Link from "next/link";
import Image from "next/image";

export default function CompetitionHeader({ competition }) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(competition.name);
  const [imageUrl, setImageUrl] = useState(competition.imageUrl || null);
  const { locale } = useLocale();

  const handleUpdate = async (e) => {
    e.preventDefault();

    const result = await updateCompetition({
      id: competition.id,
      name: newName,
      imageUrl,
      rowVersion: competition.rowVersion,
    });

    if (!result.ok) {
      toast.error(
        result.status === 409
          ? t("Update failed. Conflict:", locale) + result.message
          : t("Update failed", locale) + result.message
      );
      return;
    }

    toast.success(t("Competition updated!", locale));
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteCompetition(competition.id);
    toast.success(t("Competition deleted!", locale));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-3 p-3 border rounded-md shadow-sm bg-white w-full max-w-full overflow-hidden">
      {editing ? (
        <form
          className="flex flex-col md:flex-row gap-2 w-full items-start"
          onSubmit={handleUpdate}
        >
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border p-3 md:p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base"
            />

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-2 w-full">
              <label className="w-full sm:w-auto cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm inline-block text-center">
                {t("Odaberi sliku", locale)}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={competition.name}
                  width={48}
                  height={48}
                  className="rounded w-12 h-12 md:w-16 md:h-16 mx-auto"
                  quality={75}
                  priority={false}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 md:mt-0">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white transition text-sm w-full sm:w-auto"
            >
              {t("Save", locale)}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setImageUrl(competition.imageUrl);
              }}
              className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded text-white transition text-sm w-full sm:w-auto"
            >
              {t("Cancel", locale)}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-row justify-between items-center w-full flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {!competition.imageUrl ? (
              <div className="w-8 h-8 md:w-16 md:h-16 rounded bg-gray-200 flex items-center justify-center flex-shrink-0"></div>
            ) : (
              <Image
                src={competition.imageUrl}
                alt={competition.name}
                width={32}
                height={32}
                className="rounded object-cover flex-shrink-0 w-8 h-8 md:w-16 md:h-16"
                quality={75}
                priority={false}
              />
            )}

            <CompetitionLink
              className="flex-1 min-w-0"
              competition={competition}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Link
              href={`competition/${competition.id}`}
              className="text-blue-600 hover:underline text-sm md:text-base hidden md:inline"
            >
              {t("Matches", locale)}
            </Link>
            <Link
              href={`/teams?page=1&selectedCompetition=${competition.id}`}
              className="text-blue-600 hover:underline text-sm md:text-base hidden md:inline"
            >
              {t("Teams", locale)}
            </Link>

            <button
              onClick={() => {
                setEditing(true);
                setImageUrl(competition.imageUrl);
              }}
              className="bg-green-400 text-sm md:text-base hover:bg-green-500 px-3 py-1 rounded text-white transition"
            >
              {t("Edit", locale)}
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-100 text-sm md:text-base hover:bg-red-200 px-3 py-1 rounded text-red-600 transition"
            >
              {t("Delete", locale)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
