// "use client";

// import { useEffect, useState } from "react";

// function CompetitionSelect({ onSelect }) {
//   const [selectedCompetition, setSelectedCompetition] = useState("");
//   const [competitions, setCompetitions] = useState([]);

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

//     // ⚠️ Dodajemo prazan dependency array [] da se ne poziva beskonačno
//     fetchCompetitions();
//   }, []);

//   const handleChange = (e) => {
//     const value = e.target.value;
//     setSelectedCompetition(value);
//     if (onSelect) onSelect(value);
//   };

//   return (
//     <div className="flex flex-col space-y-2">
//       <label className="font-medium text-gray-700">Select Competition:</label>
//       <select
//         value={selectedCompetition}
//         onChange={handleChange}
//         className="border border-gray-300 rounded-lg p-2"
//       >
//         <option value="">Select Competition</option>
//         {competitions.map((c) => (
//           <option key={c.id} value={c.id}>
//             {c.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// export default CompetitionSelect;
