import CompetitionHeader from "./CompetitionHeader";

export default function CompetitionItem({ competition }) {
  return (
    <li className="border-b flex flex-col gap-2 w-full">
      <CompetitionHeader competition={competition} />
    </li>
  );
}
