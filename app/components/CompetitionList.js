// "use client";

// import { useState, useEffect } from "react";
// import Spinner from "./Spinner";
// import MatchesList from "./MatchesList";
// // import { MatchesList } from "./MatchesList";
// import { t } from "..//lib/i18n";
// import { useLocale } from "../context/LocaleContext";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// export default function CompetitionList() {
//   const [competitions, setCompetitions] = useState([]);
//   const [name, setName] = useState("");
//   const [editingCompetition, setEditingCompetition] = useState(null);
//   const [newName, setNewName] = useState("");
//   const [selectedCompetition, setSelectedCompetition] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { locale } = useLocale();

//   const fetchCompetitions = async (id) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`http://localhost:5072/api/competitions`);
//       if (!res.ok) throw new Error("Failed to fetch competitions");
//       const data = await res.json();
//       setCompetitions(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompetitions();
//   }, []);

//   // --- Add competition ---
//   const addCompetition = async (e) => {
//     e.preventDefault();
//     if (!name) return;

//     try {
//       const res = await fetch("http://localhost:5072/api/competitions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name }),
//       });
//       if (!res.ok) throw new Error("Failed to add competition");
//       setName("");
//       fetchCompetitions();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Delete competition ---
//   const deleteCompetition = async (id) => {
//     try {
//       const res = await fetch(`http://localhost:5072/api/competitions/${id}`, {
//         method: "DELETE",
//       });
//       if (!res.ok) throw new Error("Failed to delete competition");
//       if (selectedCompetition?.id === id) setSelectedCompetition(null);
//       fetchCompetitions();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // --- Edit competition ---
//   const startEdit = (competition) => {
//     setEditingCompetition(competition);
//     setNewName(competition.name);
//   };

//   const updateCompetition = async (id) => {
//     try {
//       const res = await fetch(`http://localhost:5072/api/competitions/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...editingCompetition, name: newName }),
//       });
//       if (!res.ok) throw new Error("Failed to update competition");
//       setEditingCompetition(null);
//       fetchCompetitions();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // --- Handle click ---
//   const handleCompetitionClick = (c) => {
//     if (selectedCompetition?.id === c.id) {
//       setSelectedCompetition(null);
//     } else {
//       setSelectedCompetition(c);
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="text-gray-900">
//       <h2 className="text-2xl font-semibold mb-4">
//         🏆 {t("Competitions", locale)}
//       </h2>

//       {/* Dodavanje natjecanja */}
//       <form onSubmit={addCompetition} className="flex gap-2 mb-4">
//         <input
//           type="text"
//           placeholder={t("Competition name", locale)}
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="border p-2 rounded flex-1"
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {t("Add", locale)}
//         </button>
//       </form>

//       {/* Lista natjecanja */}
//       <ul className="space-y-2">
//         {competitions.map((c) => (
//           <li key={c.id} className="border-b py-2 flex flex-col gap-2">
//             {editingCompetition?.id === c.id ? (
//               <div className="flex gap-2 items-center">
//                 <input
//                   type="text"
//                   value={newName}
//                   onChange={(e) => setNewName(e.target.value)}
//                   className="border p-1 rounded flex-1"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => updateCompetition(c.id)}
//                   className="bg-yellow-500 px-2 rounded text-white"
//                 >
//                   {t("Save", locale)}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setEditingCompetition(null)}
//                   className="bg-gray-500 px-2 rounded text-white"
//                 >
//                   {t("Cancel", locale)}
//                 </button>
//               </div>
//             ) : (
//               <div className="flex justify-between items-center">
//                 <button
//                   type="button"
//                   onClick={() => handleCompetitionClick(c)}
//                   className="text-left font-semibold hover:underline flex-1"
//                 >
//                   {c.name}
//                 </button>
//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={() => startEdit(c)}
//                     className="bg-green-500 px-2 rounded text-white"
//                   >
//                     {t("Edit", locale)}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => deleteCompetition(c.id)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     {t("Delete", locale)}
//                   </button>
//                 </div>
//               </div>
//             )}
//             {/* Matches for this competition */}
//             {selectedCompetition?.id === c.id && (
//               <div className="mt-2 pl-4">
//                 <MatchesList competition={c} />
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>

//       {competitions.length === 0 && <Spinner />}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import Spinner from "./Spinner";
import MatchesList from "./MatchesList";
import { t } from "../lib/i18n";
import { useLocale } from "../context/LocaleContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function CompetitionList() {
  const [name, setName] = useState("");
  const [editingCompetition, setEditingCompetition] = useState(null);
  const [newName, setNewName] = useState("");
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const { locale } = useLocale();
  const queryClient = useQueryClient();

  const fetchCompetitions = async () => {
    const res = await fetch("http://localhost:5072/api/competitions");
    if (!res.ok) throw new Error("Failed to fetch competitions");
    return res.json();
  };

  const { data: competitions = [], isLoading } = useQuery({
    queryKey: ["competitions"],
    queryFn: fetchCompetitions,
    staleTime: 1000 * 60 * 5,
  });

  const addCompetitionMutation = useMutation({
    mutationFn: async (competition) => {
      const res = await fetch("http://localhost:5072/api/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(competition),
      });
      if (!res.ok) throw new Error("Failed to add competition");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
      setName("");
    },
  });

  const handleAddCompetition = (e) => {
    e.preventDefault();
    if (!name) return;
    addCompetitionMutation.mutate({ name });
  };

  const deleteCompetitionMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`http://localhost:5072/api/competitions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete competition");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
    },
  });

  const updateCompetitionMutation = useMutation({
    mutationFn: async ({ id, updatedCompetition }) => {
      const res = await fetch(`http://localhost:5072/api/competitions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCompetition),
      });
      if (!res.ok) throw new Error("Failed to update competition");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
    },
  });

  
  const handleUpdateCompetition = (id) => {
    updateCompetitionMutation.mutate({
      id,
      updatedCompetition: { name: newName },
    });
    setEditingCompetition(null);
  };

  const handleCompetitionClick = (c) => {
    setSelectedCompetition(selectedCompetition?.id === c.id ? null : c);
  };
  const startEdit = (competition) => {
    setEditingCompetition(competition);
    setNewName(competition.name);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="text-gray-900">
      <h2 className="text-2xl font-semibold mb-4">
        🏆 {t("Competitions", locale)}
      </h2>

      <form onSubmit={handleAddCompetition} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder={t("Competition name", locale)}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t("Add", locale)}
        </button>
      </form>

      <ul className="space-y-2">
        {competitions.map((c) => (
          <li key={c.id} className="border-b py-2 flex flex-col gap-2">
            {editingCompetition?.id === c.id ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border p-1 rounded flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateCompetition(c.id)}
                  className="bg-yellow-500 px-2 rounded text-white"
                >
                  {t("Save", locale)}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCompetition(null)}
                  className="bg-gray-500 px-2 rounded text-white"
                >
                  {t("Cancel", locale)}
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleCompetitionClick(c)}
                  className="text-left font-semibold hover:underline flex-1"
                >
                  {c.name}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(c)}
                    //onClick={() => setEditingCompetition(c)}
                    className="bg-green-500 px-2 rounded text-white"
                  >
                    {t("Edit", locale)}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCompetitionMutation.mutate(c.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {t("Delete", locale)}
                  </button>
                </div>
              </div>
            )}

            {selectedCompetition?.id === c.id && (
              <div className="mt-2 pl-4">
                <MatchesList competition={c} />
              </div>
            )}
          </li>
        ))}
      </ul>

      {competitions.length === 0 && <Spinner />}
    </div>
  );
}
