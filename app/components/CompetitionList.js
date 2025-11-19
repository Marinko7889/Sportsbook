import { fetchCompetitions } from "../actions/competitions";
import CompetitionItem from "./CompetitionItem";
import AddCompetitionForm from "./AddCompetition";
export default async function CompetitionList() {
  const competitions = await fetchCompetitions();
  const BASE_URL = process.env.BASE_URL;

  return (
    <div className="text-gray-900">
      <h2 className="text-2xl font-semibold mb-4">Competitions</h2>
      <AddCompetitionForm />
      <ul className="space-y-2">
        {competitions.map((c) => (
          <CompetitionItem key={c.id} competition={c} BASE_URL={BASE_URL} />
        ))}
      </ul>
    </div>
  );
}

// // "use client";

// // import { useState } from "react";
// // import Spinner from "./Spinner";
// // import MatchesList from "./MatchesList";
// // import { t } from "../lib/i18n";
// // import { useLocale } from "../context/LocaleContext";
// // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// // export default function CompetitionList() {
// //   const [name, setName] = useState("");
// //   const [editingCompetition, setEditingCompetition] = useState(null);
// //   const [newName, setNewName] = useState("");
// //   const [selectedCompetition, setSelectedCompetition] = useState(null);
// //   const { locale } = useLocale();
// //   const queryClient = useQueryClient();

// //   const fetchCompetitions = async () => {
// //     const res = await fetch("http://localhost:5072/api/competitions", {
// //       credentials: "include",
// //     });
// //     if (!res.ok) throw new Error("Failed to fetch competitions");
// //     return res.json();
// //   };

// //   const { data: competitions = [], isLoading } = useQuery({
// //     queryKey: ["competitions"],
// //     queryFn: fetchCompetitions,
// //     staleTime: 1000 * 60 * 5,
// //   });

// //   const addCompetitionMutation = useMutation({
// //     mutationFn: async (competition) => {
// //       const res = await fetch("http://localhost:5072/api/competitions", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(competition),
// //         credentials: "include",
// //       });
// //       if (!res.ok) throw new Error("Failed to add competition");
// //       return res.json();
// //     },
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["competitions"] });
// //       setName("");
// //     },
// //   });

// //   const handleAddCompetition = (e) => {
// //     e.preventDefault();
// //     if (!name) return;
// //     addCompetitionMutation.mutate({ name });
// //   };

// //   const deleteCompetitionMutation = useMutation({
// //     mutationFn: async (id) => {
// //       const res = await fetch(`http://localhost:5072/api/competitions/${id}`, {
// //         method: "DELETE",
// //         credentials: "include",
// //       });
// //       if (!res.ok) throw new Error("Failed to delete competition");
// //       return res;
// //     },
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["competitions"] });
// //     },
// //   });

// //   const updateCompetitionMutation = useMutation({
// //     mutationFn: async ({ id, updatedCompetition }) => {
// //       const res = await fetch(`http://localhost:5072/api/competitions/${id}`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(updatedCompetition),
// //         credentials: "include",
// //       });
// //       if (!res.ok) throw new Error("Failed to update competition");
// //       return res.json();
// //     },
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["competitions"] });
// //     },
// //   });

// //   const handleUpdateCompetition = (id) => {
// //     if (!editingCompetition?.rowVersion) {
// //       console.error("Cannot update: RowVersion is missing!");
// //       return;
// //     }
// //     updateCompetitionMutation.mutate({
// //       id,
// //       updatedCompetition: {
// //         name: newName,
// //         rowVersion: editingCompetition.rowVersion,
// //       },
// //     });
// //     setEditingCompetition(null);
// //   };

// //   const handleCompetitionClick = (c) => {
// //     setSelectedCompetition(selectedCompetition?.id === c.id ? null : c);
// //   };
// //   const startEdit = (competition) => {
// //     console.log("Editing competition:", competition);

// //     //setEditingCompetition(competition);
// //     setEditingCompetition({
// //       ...competition,
// //       rowVersion:
// //         competition.rowVersion ||
// //         btoa(String.fromCharCode(...new Uint8Array(8))), // fallback
// //     });
// //     setNewName(competition.name);
// //   };

// //   if (isLoading) return <Spinner />;

// //   return (
// //     <div className="text-gray-900">
// //       <h2 className="text-2xl font-semibold mb-4">
// //         🏆 {t("Competitions", locale)}
// //       </h2>

// //       <form onSubmit={handleAddCompetition} className="flex gap-2 mb-4">
// //         <input
// //           type="text"
// //           placeholder={t("Competition name", locale)}
// //           value={name}
// //           onChange={(e) => setName(e.target.value)}
// //           className="border p-2 rounded flex-1"
// //         />
// //         <button
// //           type="submit"
// //           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
// //         >
// //           {t("Add", locale)}
// //         </button>
// //       </form>

// //       <ul className="space-y-2">
// //         {competitions.map((c) => (
// //           <li key={c.id} className="border-b py-2 flex flex-col gap-2">
// //             {editingCompetition?.id === c.id ? (
// //               <div className="flex gap-2 items-center">
// //                 <input
// //                   type="text"
// //                   value={newName}
// //                   onChange={(e) => setNewName(e.target.value)}
// //                   className="border p-1 rounded flex-1"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => handleUpdateCompetition(c.id)}
// //                   className="bg-yellow-500 px-2 rounded text-white"
// //                 >
// //                   {t("Save", locale)}
// //                 </button>
// //                 <button
// //                   type="button"
// //                   onClick={() => setEditingCompetition(null)}
// //                   className="bg-gray-500 px-2 rounded text-white"
// //                 >
// //                   {t("Cancel", locale)}
// //                 </button>
// //               </div>
// //             ) : (
// //               <div className="flex justify-between items-center">
// //                 <button
// //                   type="button"
// //                   onClick={() => handleCompetitionClick(c)}
// //                   className="text-left font-semibold hover:underline flex-1"
// //                 >
// //                   {c.name}
// //                 </button>
// //                 <div className="flex gap-2">
// //                   <button
// //                     type="button"
// //                     onClick={() => startEdit(c)}
// //                     //onClick={() => setEditingCompetition(c)}
// //                     className="bg-green-500 px-2 rounded text-white"
// //                   >
// //                     {t("Edit", locale)}
// //                   </button>
// //                   <button
// //                     type="button"
// //                     onClick={() => deleteCompetitionMutation.mutate(c.id)}
// //                     className="text-red-600 hover:text-red-800"
// //                   >
// //                     {t("Delete", locale)}
// //                   </button>
// //                 </div>
// //               </div>
// //             )}

// //             {selectedCompetition?.id === c.id && (
// //               <div className="mt-2 pl-4">
// //                 <MatchesList competition={c} />
// //               </div>
// //             )}
// //           </li>
// //         ))}
// //       </ul>

// //       {/* {competitions.length === 0 && <Spinner />} */}
// //     </div>
// //   );
// // }
