"use client";
import Spinner from "@/app/components/Spinner";
import UnesiIgraca from "@/app/components/UnesiIgraca";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function TeamPage() {
  const { id } = useParams();
  const teamId = parseInt(id, 10);

  const fetchTimovi = async () => {
    const res = await fetch("http://localhost:5072/api/teams");
    if (!res.ok) throw new Error("Greška pri dohvaćanju timova");
    return res.json();
  };

  const { data: teams = [], isLoading: isLoadingTeams } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTimovi,
    staleTime: 1000 * 5 * 6,
  });

  if (isLoadingTeams) return <Spinner />;

  const tim = teams.find((t) => t.id === teamId);
  if (!tim)
    return (
      <h1 className="text-3xl font-bold text-center mt-10">Nepoznat tim</h1>
    );

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold uppercase mb-8 text-center">
        {tim.name}
      </h1>

      <UnesiIgraca timovi={[tim]} samoZaTimId={teamId} />
    </div>
  );
}
