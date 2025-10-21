"use client";
import Spinner from "@/app/components/Spinner";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function TeamPage() {
  const { id } = useParams();
  const teamId = parseInt(id, 10);
  const fetchTimovi = async () => {
    const res = await fetch("http://localhost:5072/api/teams");
    if (!res.ok) throw new Error("Greska");
    return res.json();
  };
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTimovi,
    staleTime: 1000 * 5 * 6,
  });
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
  const Tim = teams.find((t) => t.id === teamId);
  const imeTima = Tim ? Tim.name : "Npoznat tim";
  const igraciTima = igraci.filter((i) => i.teamId === teamId);
  // const nazivTima = igraciTima[0].team.name;
  if (isLoadingIgraci) return <Spinner />;

  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-bold uppercase mb-4">{imeTima}</h1>
      <h1 className="text-2xl">Popis igraca</h1>
      <ul className="w-full max-w-md space-y-3">
        {igraciTima.map((igrac) => {
          return (
            <li
              key={igrac.id}
              className="flex justify-between bg-gray-100 p-3 rounded shadow"
            >
              {igrac.ime}---{igrac.age}--{igrac.position}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
