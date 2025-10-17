"use client";

import TeamList from "../components/TeamList";
import TeamForm from "../components/TeamForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../components/Spinner";

export default function TeamsPage() {
  const queryClient = useQueryClient();

  const fetchTeams = async () => {
    const res = await fetch("http://localhost:5072/api/teams");
    if (!res.ok) throw new Error("Failed to fetch teams");
    return res.json();
  };

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    staleTime: 1000 * 60 * 5,
  });

  const addTeamMutation = useMutation({
    mutationFn: (team) =>
      fetch("http://localhost:5072/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(team),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teams"] }),
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (id) =>
      fetch(`http://localhost:5072/api/teams/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teams"] }),
  });

  if (isLoading)
    return (
      <p>
        <Spinner />
      </p>
    );

  return (
    <div>
      <h1 className="text-center text-3xl font-bold mt-4">Sportsbook</h1>
      <TeamForm onAdd={(team) => addTeamMutation.mutate(team)} />
      <TeamList
        teams={teams}
        onDelete={(id) => deleteTeamMutation.mutate(id)}
      />
    </div>
  );
}
