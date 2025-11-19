import { fetchTeams } from "../actions/teams";
import { fetchMatches } from "../actions/matches";
import MatchesForm from "./MatchesForm";
import MatchItem from "./MatchItem";

export default async function MatchesList({ competition }) {
  const [teams, matches] = await Promise.all([
    fetchTeams(),
    fetchMatches(competition.name),
  ]);

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded">
        <MatchesForm teams={teams} competitionId={competition.id} />
      </div>

      {matches.length > 0 ? (
        <ul className="space-y-2">
          {matches.map((m) => (
            <MatchItem key={m.matchId} match={m} />
          ))}
        </ul>
      ) : (
        <p>No matches found.</p>
      )}
    </div>
  );
}
