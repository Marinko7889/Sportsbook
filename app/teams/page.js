import TeamForm from "../components/TeamForm";
import TeamList from "../components/TeamList";

export default async function TeamsPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-center text-3xl font-bold mb-6">Sportsbook</h1>
      <TeamForm />
      <TeamList />
    </div>
  );
}
