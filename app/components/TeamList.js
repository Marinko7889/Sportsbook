import TeamItem from "./TeamItem";
export default function TeamList({ teamsData }) {
  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded-xl shadow-md">
      <ul className="space-y-2">
        {teamsData.data.length > 0 ? (
          teamsData.data.map((team) => <TeamItem key={team.id} team={team} />)
        ) : (
          <li className="text-gray-500">No teams found.</li>
        )}
      </ul>
    </div>
  );
}
