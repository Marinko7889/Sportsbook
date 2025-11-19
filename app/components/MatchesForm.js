"use client";
import { useTransition } from "react";
import { addMatch } from "../actions/matches";
import toast from "react-hot-toast";
import { t } from "../lib/i18n";
import { useLocale } from "../context/LocaleContext";
export default function MatchesForm({ teams, competitionId }) {
  const [pending, startTransition] = useTransition();
  const { locale } = useLocale();
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const homeTeamId = Number(formData.get("homeTeam"));
    const awayTeamId = Number(formData.get("awayTeam"));
    const date = formData.get("date");

    if (homeTeamId === awayTeamId) {
      toast.error(t("Home and away teams cannot be the same", locale));
      return;
    }

    if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
      toast.error(t("Match date cannot be in the past", locale));
      return;
    }

    startTransition(async () => {
      const result = await addMatch({
        homeTeamId,
        awayTeamId,
        competitionId,
        date,
      });

      if (result.ok) {
        toast.success(t("Match added successfully!", locale));
        form.reset();
      } else {
        toast.error(result.error || t("Failed to add match", locale));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[150px]">
        <h3 className="font-semibold mb-3">{t("Add New Match", locale)}</h3>

        <label className="block text-sm font-medium mb-1">
          {t("Home Team", locale)}
        </label>
        <select
          name="homeTeam"
          required
          className="w-full border p-2 rounded"
          disabled={pending}
        >
          <option value="">{t("Select home team", locale)}</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium mb-1">
          {t("Away Team", locale)}
        </label>
        <select
          name="awayTeam"
          required
          className="w-full border p-2 rounded"
          disabled={pending}
        >
          <option value="">{t("Select away team", locale)}</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium mb-1">
          {t("Match Date", locale)}
        </label>
        <input
          type="date"
          name="date"
          required
          className="w-full border p-2 rounded"
          disabled={pending}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className="flex-1 min-w-[100px]">
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {pending ? t("Adding...", locale) : t("Add Match", locale)}
        </button>
      </div>
    </form>
  );
}

// "use client";
// import { useTransition, useState } from "react";
// import { addMatch } from "../actions/matches";
// import toast from "react-hot-toast";

// export default function MatchesForm({ teams, competitionId }) {
//   const [pending, startTransition] = useTransition();
//   const [formKey, setFormKey] = useState(0);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const formData = new FormData(form);

//     const homeTeamId = Number(formData.get("homeTeam"));
//     const awayTeamId = Number(formData.get("awayTeam"));
//     const date = formData.get("date");

//     // Validacija
//     if (homeTeamId === awayTeamId) {
//       toast.error("Home and away teams cannot be the same");
//       return;
//     }

//     if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
//       toast.error("Match date cannot be in the past");
//       return;
//     }

//     startTransition(async () => {
//       const result = await addMatch({
//         homeTeamId,
//         awayTeamId,
//         competitionId,
//         date,
//       });

//       if (result.ok) {
//         toast.success("Match added successfully!");
//         form.reset();
//         setFormKey((prev) => prev + 1);
//       } else {
//         toast.error(result.error || "Failed to add match");
//       }
//     });
//   };

//   return (
//     <form
//       key={formKey}
//       onSubmit={handleSubmit}
//       className="flex flex-wrap gap-3 items-end"
//     >
//       <div className="flex-1 min-w-[150px]">
//         <label className="block text-sm font-medium mb-1">Home Team</label>
//         <select
//           name="homeTeam"
//           required
//           className="w-full border p-2 rounded"
//           disabled={pending}
//         >
//           <option value="">Select home team</option>
//           {teams.map((team) => (
//             <option key={team.id} value={team.id}>
//               {team.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="flex-1 min-w-[150px]">
//         <label className="block text-sm font-medium mb-1">Away Team</label>
//         <select
//           name="awayTeam"
//           required
//           className="w-full border p-2 rounded"
//           disabled={pending}
//         >
//           <option value="">Select away team</option>
//           {teams.map((team) => (
//             <option key={team.id} value={team.id}>
//               {team.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="flex-1 min-w-[150px]">
//         <label className="block text-sm font-medium mb-1">Match Date</label>
//         <input
//           type="date"
//           name="date"
//           required
//           className="w-full border p-2 rounded"
//           disabled={pending}
//           min={new Date().toISOString().split("T")[0]}
//         />
//       </div>

//       <div className="flex-1 min-w-[100px]">
//         <button
//           type="submit"
//           disabled={pending}
//           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
//         >
//           {pending ? "Adding..." : "Add Match"}
//         </button>
//       </div>
//     </form>
//   );
// }
