import CompetitionHeader from "./CompetitionHeader";
import MatchesList from "./MatchesList";

export default async function CompetitionItem({ competition, BASE_URL }) {
  return (
    <li className="border-b py-2 flex flex-col gap-2">
      <CompetitionHeader competition={competition} BASE_URL={BASE_URL}>
        <MatchesList competition={competition} BASE_URL={BASE_URL} />
      </CompetitionHeader>
    </li>
  );
}
