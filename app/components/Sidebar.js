"use client";

import { useRouter } from "next/navigation";
import { logout } from "../lib/auth";
import { t } from "../lib/i18n";
import { useLocale } from "../context/LocaleContext";
export default function Sidebar({ active, setActive }) {
  const { locale } = useLocale();
  const router = useRouter();

  const handleClick = (tab, path) => {
    setActive(tab);
    router.push(path);
  };

  const handleLogout = () => {
    logout(); // briše sve iz localStorage
    router.push("/login");
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
      <button
        className={`mb-2 p-2 text-left ${
          active === "competitions" ? "bg-gray-700" : ""
        }`}
        onClick={() => handleClick("competitions", "/competitions")}
      >
        {t("Competitions", locale)}
      </button>
      <button
        className={`mb-2 p-2 text-left ${
          active === "teams" ? "bg-gray-700" : ""
        }`}
        onClick={() => handleClick("teams", "/teams")}
      >
        {t("Teams", locale)}
      </button>

      <div className="mt-auto">
        <button
          className="p-2 w-full bg-red-600 hover:bg-red-700 rounded"
          onClick={handleLogout}
        >
          {t("Logout", locale)}
        </button>
      </div>
    </div>
  );
}
