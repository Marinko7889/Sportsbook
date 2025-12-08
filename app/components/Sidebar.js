"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale } from "../context/LocaleContext";
import { t } from "../lib/i18n";
import { logoutUser } from "../actions/auth";

export default function Sidebar({ onNavigate }) {
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = () => {
    if (onNavigate) onNavigate();
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col overflow-hidden">
      <Link
        href="/competition"
        className={`mb-2 p-2 w-full${
          pathname === "/competition" ? "bg-gray-700" : ""
        }`}
        onClick={handleNav}
      >
        {t("Competitions", locale)}
      </Link>

      <Link
        href="/teams"
        className={`mb-2 p-2 w-full ${
          pathname === "/teams" ? "bg-gray-700" : ""
        }`}
        onClick={handleNav}
      >
        {t("Teams", locale)}
      </Link>

      <Link
        href="/matches"
        className={`mb-2 p-2 w-full ${
          pathname === "/matches" ? "bg-gray-700" : ""
        }`}
        onClick={handleNav}
      >
        {t("Matches", locale)}
      </Link>

      <div className="mt-auto">
        <button
          className="py-2 w-full bg-red-600 hover:bg-red-700 rounded"
          onClick={handleLogout}
        >
          {t("Logout", locale)}
        </button>
      </div>
    </div>
  );
}
