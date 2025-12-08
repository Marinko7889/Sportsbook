// "use client";
// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import Spinner from "./Spinner";
// import toast, { Toaster } from "react-hot-toast";
// import { useRouter } from "next/navigation";

// function UnesiIgraca({ timovi, samoZaTimId = null }) {
//   const [ime, setIme] = useState("");
//   const [age, setAge] = useState("");
//   const [pozicija, setPozicija] = useState("");
//   const [selectedTeamId, setSelectedTeamId] = useState("");

//   const [traziTim, setTraziTim] = useState("");

//   const [editingId, setEditingId] = useState(null);
//   const [editIme, setEditIme] = useState("");
//   const [editAge, setEditAge] = useState("");
//   const [editPozicija, setEditPozicija] = useState("");
//   const [editTeamId, setEditTeamId] = useState("");

//   const queryClient = useQueryClient();
//   const router = useRouter();

//   const fetchIgraci = async () => {
//     const res = await fetch("http://localhost:5072/api/igrac");
//     if (!res.ok) throw new Error("Greška pri dohvaćanju igrača");
//     return res.json();
//   };

//   const { data: igraci = [], isLoading: isLoadingIgraci } = useQuery({
//     queryKey: ["igraci"],
//     queryFn: fetchIgraci,
//     staleTime: 1000 * 5 * 6,
//   });

//   // Dodavanje
//   const addIgraciMutation = useMutation({
//     mutationFn: async (igrac) => {
//       const res = await fetch("http://localhost:5072/api/igrac", {
//         method: "POST",
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify(igrac),
//       });
//       if (!res.ok) throw new Error("Greška pri dodavanju igrača");
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["igraci"] });
//       toast.success("Uspješno dodan igrač!");
//       setIme("");
//       setAge("");
//       setPozicija("");
//       setSelectedTeamId("");
//     },
//   });

//   const deleteIgracMutation = useMutation({
//     mutationFn: async (id) => {
//       const res = await fetch(`http://localhost:5072/api/igrac/${id}`, {
//         method: "DELETE",
//       });
//       if (!res.ok) throw new Error("Greška pri brisanju");
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["igraci"] });
//       toast.success("Igrač obrisan!");
//     },
//   });

//   const updateIgracMutation = useMutation({
//     mutationFn: async (igrac) => {
//       const res = await fetch(`http://localhost:5072/api/igrac/${igrac.id}`, {
//         method: "PUT",
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({
//           Id: igrac.id,
//           Ime: igrac.ime,
//           Age: igrac.age,
//           Position: igrac.position,
//           TeamId: igrac.TeamId,
//         }),
//       });
//       if (!res.ok) throw new Error("Greška pri ažuriranju");
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["igraci"] });
//       toast.success("Igrač ažuriran!");
//       setEditingId(null);
//     },
//   });

//   const handleAdd = () => {
//     if (!ime || !age || !pozicija || (!samoZaTimId && !selectedTeamId)) {
//       toast.error("Nisi unio sva polja!");
//       return;
//     }

//     addIgraciMutation.mutate({
//       Ime: ime,
//       Age: parseInt(age, 10),
//       Position: pozicija,
//       TeamId: samoZaTimId
//         ? samoZaTimId
//         : selectedTeamId
//         ? parseInt(selectedTeamId, 10)
//         : null,
//     });
//   };

//   const handleEdit = (igrac) => {
//     setEditingId(igrac.id);
//     setEditIme(igrac.ime);
//     setEditAge(igrac.age);
//     setEditPozicija(igrac.position);
//     setEditTeamId(igrac.teamId?.toString() || "");
//   };

//   const handleSaveEdit = (id) => {
//     updateIgracMutation.mutate({
//       id,
//       ime: editIme,
//       age: parseInt(editAge, 10),
//       position: editPozicija,
//       TeamId: samoZaTimId
//         ? samoZaTimId
//         : editTeamId
//         ? parseInt(editTeamId, 10)
//         : null,
//     });
//   };

//   const filtriraniIgraci = samoZaTimId
//     ? igraci.filter((i) => i.teamId === samoZaTimId)
//     : igraci;

//   const handleTraziTim = (imeTima) => {
//     const tim = timovi.find(
//       (t) => t.name.toLowerCase() === imeTima.toLowerCase()
//     );

//     if (tim) {
//       router.push(`/teams/${tim.id}`);
//     } else {
//       toast.error("Nije pronađen taj klub!");
//     }
//   };
//   return (
//     <>
//       <div className="flex flex-col items-center mb-10 ml-25 w-full max-w-md">
//         <h2 className="text-2xl font-semibold mb-4">Unesi novog igrača</h2>
//         <input
//           placeholder="Unesi ime igrača"
//           className="border p-2 mb-2 w-full rounded"
//           value={ime}
//           onChange={(e) => setIme(e.target.value)}
//         />
//         <input
//           placeholder="Unesi godine"
//           className="border p-2 mb-2 w-full rounded"
//           value={age}
//           onChange={(e) => setAge(e.target.value)}
//         />
//         <input
//           placeholder="Unesi poziciju"
//           className="border p-2 mb-3 w-full rounded"
//           value={pozicija}
//           onChange={(e) => setPozicija(e.target.value)}
//         />

//         {!samoZaTimId && (
//           <select
//             value={selectedTeamId}
//             onChange={(e) => setSelectedTeamId(e.target.value)}
//             className="border p-2 mb-3 w-full rounded"
//           >
//             <option value="">Odaberi klub</option>
//             {timovi.map((tim) => (
//               <option key={tim.id} value={tim.id}>
//                 {tim.name}
//               </option>
//             ))}
//           </select>
//         )}

//         <button
//           className="bg-green-500 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded"
//           onClick={handleAdd}
//         >
//           Dodaj igrača
//         </button>
//         <Toaster position="top-center" />
//         {!samoZaTimId && (
//           <div className="my-10 flex items-center gap-3">
//             <input
//               placeholder="Trazi tim"
//               value={traziTim}
//               onChange={(e) => setTraziTim(e.target.value)}
//               className="border p-2 rounded"
//             />
//             <button
//               className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded"
//               onClick={() => handleTraziTim(traziTim)}
//             >
//               Pretraži
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="w-full max-w-2xl">
//         <h2 className="text-2xl font-semibold mb-3">Popis igrača</h2>
//         {isLoadingIgraci ? (
//           <Spinner />
//         ) : filtriraniIgraci.length === 0 ? (
//           <p>Nema igrača u ovom timu.</p>
//         ) : (
//           <ul className="space-y-2">
//             {filtriraniIgraci.map((igrac) => (
//               <li
//                 key={igrac.id}
//                 className="flex justify-between items-center bg-gray-100 p-3 rounded shadow-sm"
//               >
//                 {editingId === igrac.id ? (
//                   <div className="flex flex-col w-full">
//                     <input
//                       value={editIme}
//                       onChange={(e) => setEditIme(e.target.value)}
//                       className="border p-1 mb-1 rounded"
//                     />
//                     <input
//                       value={editAge}
//                       onChange={(e) => setEditAge(e.target.value)}
//                       className="border p-1 mb-1 rounded"
//                     />
//                     <input
//                       value={editPozicija}
//                       onChange={(e) => setEditPozicija(e.target.value)}
//                       className="border p-1 mb-1 rounded"
//                     />

//                     {!samoZaTimId && (
//                       <select
//                         value={editTeamId}
//                         onChange={(e) => setEditTeamId(e.target.value)}
//                         className="border p-1 mb-2 rounded"
//                       >
//                         <option value="">Odaberi klub</option>
//                         {timovi.map((tim) => (
//                           <option key={tim.id} value={tim.id}>
//                             {tim.name}
//                           </option>
//                         ))}
//                       </select>
//                     )}

//                     <div className="flex gap-2">
//                       <button
//                         className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                         onClick={() => handleSaveEdit(igrac.id)}
//                       >
//                         Spremi
//                       </button>
//                       <button
//                         className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
//                         onClick={() => setEditingId(null)}
//                       >
//                         Odustani
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div>
//                       <p className="font-semibold">
//                         {igrac.ime} ({igrac.age}) — {igrac.position}
//                       </p>
//                       {igrac.team && !samoZaTimId && (
//                         <p className="text-sm text-gray-600">
//                           Klub:{" "}
//                           <button
//                             onClick={() =>
//                               router.push(`/teams/${igrac.team.id}`)
//                             }
//                             className="text-blue-600 hover:underline"
//                           >
//                             {igrac.team.name}
//                           </button>
//                         </p>
//                       )}
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
//                         onClick={() => handleEdit(igrac)}
//                       >
//                         Uredi
//                       </button>
//                       <button
//                         onClick={() => deleteIgracMutation.mutate(igrac.id)}
//                         className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//                       >
//                         Obriši
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </>
//   );
// }

// export default UnesiIgraca;
