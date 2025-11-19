import { fetchCompetitions } from "../actions/competitions";
import CompetitionItem from "./CompetitionItem";
import AddCompetitionForm from "./AddCompetition";
export default async function CompetitionList() {
  const competitions = await fetchCompetitions();
  const BASE_URL = process.env.BASE_URL;

  return (
    <div className="text-gray-900">
      <h2 className="text-2xl font-semibold mb-4">Competitions</h2>
      <AddCompetitionForm />
      <ul className="space-y-2">
        {competitions.map((c) => (
          <CompetitionItem key={c.id} competition={c} BASE_URL={BASE_URL} />
        ))}
      </ul>
    </div>
  );
}
