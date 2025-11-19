import { fetchTeams, deleteTeam } from "../actions/teams";
import DeleteTeamButton from "../components/DeleteTeamButton";
export default async function TeamList() {
  const teams = await fetchTeams();
  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded-xl shadow-md">
      <ul className="space-y-2">
        {teams.map((team) => (
          <li
            key={team.id}
            className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
          >
            <span>{team.name}</span>

            <DeleteTeamButton teamId={team.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
