// "use client";

// import { useEffect, useState } from "react";

// export default function CompetitionSidebar({ onSelect }) {
//   const [competitions, setCompetitions] = useState([]);
//   const [visible, setVisible] = useState(true); // za prikaz/skrivanje sidebara
//   const [selectedId, setSelectedId] = useState(null);

//   useEffect(() => {
//     const fetchCompetitions = async () => {
//       try {
//         const res = await fetch("http://localhost:5072/api/competitions");
//         if (!res.ok) throw new Error("Failed to fetch competitions");
//         const data = await res.json();
//         setCompetitions(data);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     };
//     fetchCompetitions();
//   }, []);

//   return (
//     <div className="flex">
//       {/* Gumb za otvaranje/zatvaranje */}
//       <button
//         onClick={() => setVisible(!visible)}
//         className="m-2 px-3 py-2 bg-blue-600 text-white rounded-lg"
//       >
//         {visible ? "Hide Competitions" : "Show Competitions"}
//       </button>

//       {/* Sidebar */}
//       {visible && (
//         <div className="w-64 h-screen bg-gray-100 shadow-md p-4 overflow-y-auto">
//           <h2 className="text-lg font-semibold mb-4">Competitions</h2>
//           <ul className="space-y-2">
//             {competitions.map((c) => (
//               <li key={c.id}>
//                 <button
//                   onClick={() => {
//                     setSelectedId(c.id);
//                     if (onSelect) onSelect(c.id);
//                   }}
//                   className={`block w-full text-left px-3 py-2 rounded-lg ${
//                     selectedId === c.id
//                       ? "bg-blue-500 text-white"
//                       : "hover:bg-blue-100"
//                   }`}
//                 >
//                   {c.name}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
