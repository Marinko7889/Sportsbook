"use client";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Play } from "next/font/google";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocale } from "../context/LocaleContext";
import { t } from "../lib/i18n";
function Igraci() {
  const { locale, setLocale } = useLocale();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [position, setPosition] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editIme, setEditIme] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editPozicija, setEditPozicija] = useState("");
  const [editTeamId, setEditTeamId] = useState("");

  const queryClient = useQueryClient();
  const FetchPlayers = async () => {
    const res = await fetch("http://localhost:5072/api/Igrac");
    if (!res.ok) throw new Error("Problem pri dohvacanju podataka");
    return res.json();
  };
  const fetchTeams = async () => {
    const res = await fetch("http://localhost:5072/api/teams");
    if (!res.ok) throw new Error("Greska");
    return res.json();
  };
  const { data: Players = [], isLoading } = useQuery({
    queryKey: ["Players"],
    queryFn: FetchPlayers,
    staleTime: 1000 * 60 * 5,
  });
  const { data: Teams = [], isLoadingTeams } = useQuery({
    queryKey: ["Teams"],
    queryFn: fetchTeams,
    staleTime: 1000 * 60 * 5,
  });

  const addPlayerMutation = useMutation({
    mutationFn: (player) =>
      fetch("http://localhost:5072/api/Igrac", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(player),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries(
        { queryKey: ["Players"] },
        toast.success("Uspjeno dodan igrac")
      ),
    onError: () => console.log("Greska"),
  });
  const deletePlayerMutation = useMutation({
    mutationFn: (id) =>
      fetch(`http://localhost:5072/api/Igrac/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      queryClient.invalidateQueries(
        { queryKey: ["Players"] },
        toast.success("Uspjesno izbrisan igrac")
      ),
    onError: () => toast.error("Greska pri brisanju igraca"),
  });
  const updatePlayerMutation = useMutation({
    mutationFn: (player) =>
      fetch(`http://localhost:5072/api/Igrac/${player.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: player.id,
          ime: player.ime,
          age: player.age,
          position: player.position,
          TeamId: player.teamId,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Players"] });
      toast.success("Igrač ažuriran!");
      setEditingId(null);
    },
  });

  const napadaci = Players.filter((player) => player.position === "Napad");
  const centar = Players.filter((player) => player.position === "Centar");
  const olderThan30 = Players.filter((player) => player.age > 29);
  const olderThan30andCenter = Players.filter(
    (player) => player.age > 29 && player.position === "Centar"
  );

  const groupedByPosition = Players.reduce((group, player) => {
    const pos = player.position;
    if (!group[pos]) group[pos] = [];
    group[pos].push(player);
    return group;
  }, {});

  const groupedByAge = Players.reduce((group, player) => {
    let grupa = "";
    if (player.age < 21) grupa = "U-20";
    else if (player.age < 35) grupa = "U-35";
    else if (player.age >= 35) grupa = "+35";
    group[grupa] = group[grupa] || [];
    group[grupa].push(player);
    return group;
  }, {});
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !age || !position) {
      toast.error("Nisi unio sva polja");
      return;
    }
    addPlayerMutation.mutate({
      ime: name,
      age: Number(age),
      position: position,
      teamId: Number(selectedTeam),
    });
    console.log(Number(selectedTeam));
    setName("");
    setAge("");
    setPosition("");
    setSelectedTeam("");
  };
  const handleDelete = (id) => {
    deletePlayerMutation.mutate(id);
  };
  const handleUpdate = (id) => {
    if (!editIme || !editAge || !editPozicija || !editTeamId) {
      toast.error("Popuni sva polja prije spremanja!");
      return;
    }

    updatePlayerMutation.mutate({
      id: id,
      ime: editIme,
      age: Number(editAge),
      position: editPozicija,
      teamId: Number(editTeamId),
    });
  };
  return (
    <div>
      <h1>{t("Save", locale)}</h1>
      {t("Login", locale)}

      <button classname="ml-5" onClick={() => setLocale("en")}>
        EN
      </button>
      <button className="mx-3" onClick={() => setLocale("hr")}>
        HR
      </button>
      <button onClick={() => setLocale("es")}>ES</button>

      <ul className="flex flex-col gap-2 w-2/3 mr-auto">
        {Players.sort((a, b) => a.id - b.id).map((player) => (
          <li
            key={player.id}
            className="grid grid-cols-6 items-center border p-2 rounded"
          >
            {editingId === player.id ? (
              <>
                <input
                  value={editIme}
                  onChange={(e) => setEditIme(e.target.value)}
                  className="border px-2 py-1"
                />
                <input
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  className="border px-2 py-1"
                />
                <input
                  value={editPozicija}
                  onChange={(e) => setEditPozicija(e.target.value)}
                  className="border px-2 py-1"
                />
                <select
                  value={editTeamId}
                  onChange={(e) => setEditTeamId(e.target.value)}
                  className="border px-2 py-1"
                >
                  <option value="">Odaberi tim</option>
                  {Teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                <button
                  className="mx-2 px-3 py-1 bg-green-500 text-white rounded"
                  onClick={() => handleUpdate(player.id)}
                >
                  Save
                </button>
                <button
                  className="mx-2 px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{player.ime}</span>
                <span>{player.age}</span>
                <span>{player.position}</span>
                <span>{player.team?.name}</span>
                <button
                  className="mx-2 px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={() => {
                    setEditingId(player.id);
                    setEditIme(player.ime);
                    setEditAge(player.age);
                    setEditPozicija(player.position);
                    setEditTeamId(player.team?.id || "");
                  }}
                >
                  Uredi
                </button>
                <button
                  className="mx-2 px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(player.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <h2 className="my-5">Napadaci</h2>
      <ul>
        {napadaci.map((napadac) => (
          <li key={napadac.id}>{napadac.ime}</li>
        ))}
      </ul>
      <h2 className="my-5">Centar</h2>
      <ul>
        {centar.map((centralni) => (
          <li key={centralni.id}>{centralni.ime}</li>
        ))}
      </ul>
      <h2 className="my-5">Stariji od 30godina</h2>
      <ul>
        {olderThan30.map((old) => (
          <li key={old.id}>
            {old.ime}
            {"  "}
            {old.age}
          </li>
        ))}
      </ul>
      <h2 className="my-5">Stariji od 30 na centru</h2>
      <ul>
        {olderThan30andCenter.map((oldand) => (
          <li key={oldand.id}>
            {oldand.ime} {oldand.age} {oldand.position}
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <h1 className="text-center text-blue-500">Dodaj igraca</h1>
        <form
          className="mt-5 flex flex-col items-center "
          onSubmit={handleSubmit}
        >
          <input
            className="my-3 text-center border-2"
            placeholder="Unesi ime igraca"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="my-3 text-center border-2"
            placeholder="Unesi godine igraca"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <input
            className="my-3 text-center border-2"
            placeholder="Unesi poziicju igraca"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <select
            className="my-3"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">Odaberi tim</option>
            {Teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <button
            className="my-3 bg-blue-400 p-2 rounded hover:bg-blue-600"
            type="submit"
          >
            Dodaj igraca
          </button>
        </form>
        <div className="mt-5">
          <h2 className="mb-5 border text-center">Grupiranje po pozicijama</h2>
          {Object.entries(groupedByPosition).map(([position, players]) => (
            <div key={position} className="mb-5">
              <h2 className="underline text-blue-400">{position}</h2>
              <ul>
                {players.map((player) => (
                  <li key={player.id}>
                    {player.ime}--{player.age}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mb-5">
          <h2 className="mb-2  border text-center">Grupiranje po godinama</h2>
          {Object.entries(groupedByAge).map(([group, players]) => (
            <div key={group} className="mb-5">
              <h2 className="text-blue-500 underline mb-4">{group}</h2>
              <ul>
                {players.map((player) => (
                  <li key={player.id}>
                    {player.ime}--{player.age}--{player.position}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Toaster position="top-center" />
      </div>
    </div>
  );
}

export default Igraci;
