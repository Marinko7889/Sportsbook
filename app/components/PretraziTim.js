// import { useState } from "react";
// import { useRouter } from "next/router";
// function PretraziTim({ igraci }) {
//   const [imePretraga, setImePretraga] = useState("");
//   const router = useRouter();

//   const handleClick = (id) => {
//     router.push(`/teams/${id}`);
//   };
//   return (
//     <div className="my-20">
//       <input
//         placeholder="Unesi ime tima"
//         onChange={(e) => setImePretraga(e.target.value)}
//       ></input>
//       <button className="ml-2" onClick={handleClick(id)}>
//         Pretrazi
//       </button>
//       <div className="mt-5">
//         <span>{imePretraga ? imePretraga : ""}</span>
//       </div>
//     </div>
//   );
// }

// export default PretraziTim;
