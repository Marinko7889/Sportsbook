"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import UnesiIgraca from "../components/UnesiIgraca";
import toast, { Toaster } from "react-hot-toast";
function VjezbaPage() {
  const queryClient = useQueryClient();
  const [ime, setIme] = useState();
  const [age, setAge] = useState();
  const [pozicija, setPoziija] = useState();
  const [tim, setTim] = useState("");
  const FetchData = async () => {
    const res = await fetch("http://localhost:5072/api/teams");
    if (!res.ok) throw new Error("Greska");
    return res.json();
  };

  const { data: timovi = [], isLoading } = useQuery({
    queryKey: ["timovi"],
    queryFn: FetchData,
    staleTime: 1000 * 6 * 5,
  });

  const addTeamMutation = useMutation({
    mutationFn: async (team) => {
      const res = await fetch("http://localhost:5072/api/teams", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: team }),
      });
      if (!res.ok) throw new Error("Greska");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timovi"] });
      toast.success("Tim je uspješno dodan!");
    },
    onError: () => toast.error("Doslo je do greske"),
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`http://localhost:5072/api/teams/${id}`, {
        method: "Delete",
      });
      if (!res.ok) throw new Error("Greska");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timovi"] });
      toast.success("Uspjesno izbrisano");
    },
  });

  const handleAdd = () => {
    addTeamMutation.mutate(tim);
    setTim("");
  };

  return (
    <div>
      {/* <h1>Pozdrav</h1>
      <ul className="mt-5">
        {timovi.map((tim) => (
          <li key={tim.id}>
            {tim.name}
            <button
              className="ml-10"
              onClick={() => deleteTeamMutation.mutate(tim.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <input
        placeholder="Dodaj tim"
        onChange={(e) => setTim(e.target.value)}
        value={tim}
      ></input>
      <button onClick={() => handleAdd()}>Dodaj</button> */}
      <Toaster position="top-center" />

      <UnesiIgraca timovi={timovi} />
    </div>
  );
}

export default VjezbaPage;
