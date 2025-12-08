import { fetchCompetitions } from "../actions/competitions";
import CompetitionList from "../components/CompetitionList";

export default async function CompetitionsPage() {
  const competitions = await fetchCompetitions();
  return (
    <div className="min-h-screen flex flex-col">
      <CompetitionList initialCompetitions={competitions} />
    </div>
  );
}
