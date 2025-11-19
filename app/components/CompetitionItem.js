import CompetitionHeader from "./CompetitionHeader";
import MatchesList from "./MatchesList";

export default async function CompetitionItem({ competition, BASE_URL }) {
  return (
    <li className="border-b py-2 flex flex-col gap-2">
      <CompetitionHeader competition={competition} BASE_URL={BASE_URL}>
        <MatchesList competition={competition} BASE_URL={BASE_URL} />
      </CompetitionHeader>
    </li>
  );
}
// "use client";
// import { Suspense, useState } from "react";
// import { deleteCompetition, updateCompetition } from "../actions/competitions";
// import MatchesList from "./MatchesList";
// import toast from "react-hot-toast";
// import Spinner from "./Spinner";
// export default function CompetitionItem({ competition, BASE_URL }) {
//   const [editing, setEditing] = useState(false);
//   const [newName, setNewName] = useState(competition.name);
//   const [selected, setSelected] = useState(false);

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     const result = await updateCompetition({
//       id: competition.id,
//       name: newName,
//       rowVersion: competition.rowVersion,
//     });

//     if (!result.ok) {
//       if (result.status === 409) {
//         toast.error("Conflict: " + result.message);
//       } else {
//         toast.error("Failed: " + result.message);
//       }
//       return;
//     }

//     toast.success("Competition updated!");
//     setEditing(false);
//   };

//   const handleDelete = async () => {
//     await deleteCompetition(competition.id);
//   };

//   return (
//     <li className="border-b py-2 flex flex-col gap-2">
//       {editing ? (
//         <form className="flex gap-2 items-center" onSubmit={handleUpdate}>
//           <input
//             type="text"
//             value={newName}
//             onChange={(e) => setNewName(e.target.value)}
//             className="border p-1 rounded flex-1"
//           />
//           <button
//             type="submit"
//             className="bg-yellow-500 px-2 rounded text-white"
//           >
//             Save
//           </button>
//           <button
//             type="button"
//             onClick={() => setEditing(false)}
//             className="bg-gray-500 px-2 rounded text-white"
//           >
//             Cancel
//           </button>
//         </form>
//       ) : (
//         <div className="flex justify-between items-center">
//           <button
//             onClick={() => setSelected(!selected)}
//             className="flex-1 text-left font-semibold hover:underline"
//           >
//             {competition.name}
//           </button>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setEditing(true)}
//               className="bg-green-500 px-2 rounded text-white"
//             >
//               Edit
//             </button>
//             <button
//               onClick={handleDelete}
//               className="text-red-600 hover:text-red-800"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       )}

//       {selected && (
//         <div className="mt-2 pl-4">
//           <Suspense fallback={<Spinner />}>
//             <MatchesList
//               key={competition.id}
//               competition={competition}
//               BASE_URL={BASE_URL}
//             />
//           </Suspense>
//         </div>
//       )}
//     </li>
//   );
// }
