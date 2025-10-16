import { useLocale } from "../context/LocaleContext";
import { t } from "..//lib//i18n";
export default function TeamList({ teams, onDelete }) {
  const { locale } = useLocale();
  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {t("Teams", locale)}
      </h2>
      {teams.length === 0 ? (
        <p className="text-center text-gray-500">
          {t("No teams yet.", locale)}
        </p>
      ) : (
        <ul className="space-y-2">
          {teams.map((team) => (
            <li
              key={team.id}
              className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
            >
              <span>{team.name}</span>
              <button
                className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => onDelete(team.id)}
              >
                {t("Delete", locale)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
