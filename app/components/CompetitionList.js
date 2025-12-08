import { fetchCompetitions } from "../actions/competitions";
import CompetitionItem from "./CompetitionItem";
import AddCompetitionForm from "./AddCompetition";
import CompetitionSearch from "./CompetitionSearch";

export default async function CompetitionList() {
  const competitions = await fetchCompetitions();

  return (
    <div className="text-gray-900 flex flex-col items-center px-2 md:items-start">
      <div className="w-full max-w-sm md:max-w-lg lg:max-w-2xl">
        <AddCompetitionForm />
      </div>

      <div className="w-full max-w-sm md:max-w-lg lg:max-w-2xl mt-4">
        <CompetitionSearch competitions={competitions} />
      </div>
    </div>
  );
}
