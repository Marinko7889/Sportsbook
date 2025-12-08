import { fetchTeamById } from "../../actions/teams";
import { fetchAllMatches, fetchMatches } from "../../actions/matches";
import { fetchCompetitions } from "../../actions/competitions";
import MatchesList from "../../components/MatchesList";
import TeamCompetitions from "../../components/TeamCompetitions";
export default async function TeamPage({ params }) {
  const teamId = parseInt(params.id, 10);

  const [team, allMatches, competitions] = await Promise.all([
    fetchTeamById(teamId),
    //fetchMatches(),
    fetchAllMatches(),
    fetchCompetitions(),
  ]);

  if (!team) return <div>Team not found</div>;
  //console.log(team);
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl text-blue-500 hover:text-blue-700 mb-6">
        {team.name}
      </h1>
      <TeamCompetitions team={team} competitions={competitions} />

      <MatchesList team={team} matches={allMatches} />
    </div>
  );
}
