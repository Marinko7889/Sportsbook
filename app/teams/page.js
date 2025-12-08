import TeamForm from "../components/TeamForm";
import TeamList from "../components/TeamList";
import { fetchCompetitions } from "../actions/competitions";
import { fetchTeams, searchTeamsServer } from "../actions/teams";
import TeamFilter from "../components/TeamFilter";
import Pagination from "../components/Pagination";
import TeamSearchBar from "../components/TeamSearchBar";
export default async function TeamsPage({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const selectedCompetition = searchParams.selectedCompetition
    ? Number(searchParams.selectedCompetition)
    : null;
  const [teamsData, competitions] = await Promise.all([
    fetchTeams(page, 20, selectedCompetition),
    fetchCompetitions(),
    //fetchTeams(),
  ]);

  console.log(teamsData);

  return (
    <div>
      {/* <Suspense> */}
      <TeamSearchBar searchFunction={searchTeamsServer} />
      {/* </Suspense> */}

      <TeamForm competitions={competitions} />

      <TeamFilter competitions={competitions} />

      <TeamList teamsData={teamsData} />

      <Pagination
        page={page}
        totalPages={teamsData.totalPages}
        selectedCompetition={selectedCompetition}
      />
    </div>
  );
}
