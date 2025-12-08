import MatchesPagination from "../components/MatchesPagination";
import { fetchCompetitions } from "../actions/competitions";
import MatchesList from "../components/MatchesList";
import { fetchMatches } from "../actions/matches";

export default async function MatchesPage({ searchParams }) {
  const page = Number(searchParams.page) || 1;

  const [competitions, matchData] = await Promise.all([
    fetchCompetitions(),
    fetchMatches(page),
  ]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Matches</h1>
      <h2 className="text-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium mb-2">
        {/* {matchData.day?.split("T")[0]} */}
        {matchData.day &&
          new Date(matchData.day).toLocaleDateString("hr-HR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
      </h2>
      {competitions.map((competition) => (
        <MatchesList
          key={competition.id}
          competition={competition}
          matches={matchData.matches}
        />
      ))}

      <MatchesPagination
        page={page}
        totalDays={matchData.totalDays}
        day={matchData.day}
      />
    </div>
  );
}
