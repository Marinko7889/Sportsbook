"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "./Spinner";
import toast, { Toaster } from "react-hot-toast";
import PretraziTim from "./PretraziTim";
import { useRouter, usePathname } from "next/navigation";
function UnesiIgraca({ timovi }) {
  const [ime, setIme] = useState("");
  const [age, setAge] = useState("");
  const [pozicija, setPoziija] = useState("");
  const [editingIgracId, setEditingIgracId] = useState(null);
  const [editingIgracIme, setEditingIgracIme] = useState("");
  const [editingIgracAge, setEditingIgracAge] = useState("");
  const [editingIgracPozicija, setEditingIgracPozicija] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [editingSelectedIgrac, setEditingSelectedIgrac] = useState("");
  const [traziTim, setTraziTim] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();
  const FetchIgraci = async () => {
    const res = await fetch("http://localhost:5072/api/igrac");
    if (!res.ok) throw new Error("Greska");
    return res.json();
  };

  const { data: igraci = [], isLoadingIgraci } = useQuery({
    queryKey: ["igraci"],
    queryFn: FetchIgraci,
    staleTime: 1000 * 5 * 6,
  });

  const addIgraciMutation = useMutation({
    mutationFn: async (igrac) => {
      const res = await fetch("http://localhost:5072/api/igrac", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(igrac),
      });
      if (!res.ok) throw new Error("Greska");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["igraci"] });
      toast.success("Uspjesno dodan igrac");
    },
  });

  const updateIgracMutation = useMutation({
    mutationFn: async (igrac) => {
      const res = await fetch(`http://localhost:5072/api/igrac/${igrac.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          Id: igrac.id,
          Ime: igrac.ime,
          Age: igrac.age,
          Position: igrac.position,
          TeamId: igrac.TeamId,
        }),
      });
      if (!res.ok) throw new Error("Greska");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["igraci"] }),
  });

  const deleteIgracMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`http://localhost:5072/api/igrac/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Greska pri brisanju");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["igraci"] }),
  });

  const handleClick = () => {
    if (!ime || !age || !pozicija || !selectedTeamId) {
      toast.error("Nisi unio sva polja");
      return;
    }

    addIgraciMutation.mutate({
      Ime: ime,
      Age: parseInt(age, 10),
      Position: pozicija,
      TeamId: selectedTeamId ? parseInt(selectedTeamId, 10) : null,
    });

    // Reset forme
    setIme("");
    setAge("");
    setPoziija("");
    setSelectedTeamId("");
  };

  const handleEditClick = (igrac) => {
    setEditingIgracId(igrac.id);
    setEditingIgracIme(igrac.ime);
    setEditingIgracAge(igrac.age);
    setEditingIgracPozicija(igrac.position);
    setEditingSelectedIgrac(
      igrac.teamId != null ? igrac.teamId.toString() : ""
    );
  };

  const handleSaveEdit = (id) => {
    updateIgracMutation.mutate({
      id,
      ime: editingIgracIme,
      age: parseInt(editingIgracAge, 10),
      position: editingIgracPozicija,
      TeamId: editingSelectedIgrac ? parseInt(editingSelectedIgrac, 10) : null,
    });
    setEditingIgracId(null);
  };

  const handleTraziTim = (imeTima) => {
    const tim = timovi.find(
      (t) => t.name.toLowerCase() === imeTima.toLowerCase()
    );

    if (tim) {
      router.push(`/teams/${tim.id}`);
    } else {
      toast.error("Nije pronaden taj klub");
    }
  };
  return (
    <>
      <div>
        <h1 className="text-2xl mt-5">Unesi novog igraca</h1>
        <input
          placeholder="Unesi igraca"
          className="my-10"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
        />
        <input
          placeholder="Unesi Godine"
          className="mt-2"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          placeholder="Unesi Poziciju"
          className="mt-2"
          value={pozicija}
          onChange={(e) => setPoziija(e.target.value)}
        />
        <select
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
        >
          <option value="">Odaberi klub</option>
          {timovi.map((tim) => (
            <option key={tim.id} value={tim.id}>
              {tim.name}
            </option>
          ))}
        </select>
        <button
          className="ml-5 rounded bg-green-500 hover:bg-green-400 p-2"
          onClick={handleClick}
        >
          Poslaji u bazu
        </button>
        <Toaster position="top-center" />
      </div>

      <div>
        <ul>
          {isLoadingIgraci ? (
            <Spinner />
          ) : (
            igraci.map((igrac) => (
              <li
                key={igrac.id}
                className="flex items-center justify-between mt-3 p-3 rounded shadow-sm bg-gray-50"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">
                    {igrac.ime} ({igrac.age}) — {igrac.position}
                  </span>
                  <span>
                    Klub:{" "}
                    {igrac.team ? (
                      <button
                        onClick={() => router.push(`/teams/${igrac.team.id}`)}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {igrac.team.name}
                      </button>
                    ) : (
                      "Nema tim"
                    )}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    className="bg-blue-500 text-white rounded px-4 py-1 hover:bg-blue-600"
                    onClick={() => handleEditClick(igrac)}
                  >
                    Uredi
                  </button>
                  <button
                    className="bg-red-500 text-white rounded px-4 py-1 hover:bg-red-600"
                    onClick={() => deleteIgracMutation.mutate(igrac.id)}
                  >
                    Izbriši
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="my-20">
          <input
            placeholder="Unesi tim"
            value={traziTim}
            onChange={(e) => setTraziTim(e.target.value)}
          ></input>
          <button className="ml-3" onClick={() => handleTraziTim(traziTim)}>
            Pretrazi
          </button>
        </div>
      </div>
    </>
  );
}

export default UnesiIgraca;
