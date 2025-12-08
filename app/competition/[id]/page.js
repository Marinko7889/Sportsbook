import MatchesList from "../../components/MatchesList";
import MatchesForm from "../../components/MatchesForm";
import { fetchCompetitions } from "../../actions/competitions";
import { fetchMatches } from "../../actions/matches";
import { fetchTeams } from "../../actions/teams";
import CompetitionLink from "@/app/components/CompetitionLink";
import MatchesPagination from "../../components/MatchesPagination";
import Image from "next/image";

export default async function CompetitionPage({ params, searchParams }) {
  const competitionId = parseInt(params.id, 10);
  const page = Number(searchParams.page) || 1;

  const [competitions, matches, teams] = await Promise.all([
    fetchCompetitions(),
    fetchMatches(page, competitionId),
    fetchTeams(1, 100, competitionId),
  ]);

  const competition = competitions.find((c) => c.id === competitionId);
  if (!competition) return <div>Competition not found</div>;

  const teamsForCompetition = teams.data;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex flex-row my-5">
        <Image
          src={competition.imageUrl}
          alt={competition.name}
          width={64}
          height={64}
          quality={75}
          priority={false}
          className="rounded mx-4"
        />
        <CompetitionLink competition={competition} />
      </div>

      <div className="mb-6">
        <MatchesForm
          teams={teamsForCompetition}
          competitionId={competition.id}
        />
      </div>

      <h2 className="text-center bg-blue-100 text-blue-800 px-3 py-2 my-5 rounded-full font-medium mb-2">
        {matches.day &&
          new Date(matches.day).toLocaleDateString("hr-HR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
      </h2>

      <MatchesList competition={competition} matches={matches.matches} />

      <MatchesPagination
        page={matches.page}
        totalDays={matches.totalDays}
        day={matches.day}
      />
    </div>
  );
}
