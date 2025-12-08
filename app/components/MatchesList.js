import MatchItem from "./MatchItem";
import CompetitionLink from "./CompetitionLink";
import Image from "next/image";
export default function MatchesList({ matches, team, competition }) {
  let filteredMatches = matches;
  if (team) {
    filteredMatches = matches.filter(
      (m) =>
        m.homeTeam.trim().toLowerCase() === team.name.trim().toLowerCase() ||
        m.awayTeam.trim().toLowerCase() === team.name.trim().toLowerCase()
    );
    //console.log(matches);
  }

  if (competition) {
    filteredMatches = filteredMatches.filter(
      (m) => m.competition === competition.name
    );
  }

  const groupedByCompetition = filteredMatches.reduce((acc, match) => {
    if (!acc[match.competition]) acc[match.competition] = [];
    acc[match.competition].push(match);
    return acc;
  }, {});

  return (
    <>
      <div className="space-y-8">
        {Object.entries(groupedByCompetition).map(([compName, compMatches]) => {
          const groupedByDate = compMatches.reduce((acc, match) => {
            const date = match.date.split("T")[0];
            if (!acc[date]) acc[date] = [];
            acc[date].push(match);
            return acc;
          }, {});
          const teamComp = team?.competitions?.find((c) => c.name === compName);
          return (
            <div
              key={compName}
              className="space-y-6 bg-white shadow rounded p-4 mb-4"
            >
              {team && (
                <div className="flex items-center gap-3 mb-4">
                  {teamComp?.imageUrl && (
                    <Image
                      src={teamComp.imageUrl}
                      alt={compName}
                      width={48}
                      height={48}
                      quality={75}
                      className="rounded w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
                    />
                  )}
                  <CompetitionLink competition={teamComp} />
                </div>
              )}
              {competition && (
                <div className="flex flex-row">
                  <Image
                    src={competition.imageUrl}
                    alt={competition.name}
                    width={48}
                    height={48}
                    quality={75}
                    priority={false}
                    className="rounded mx-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
                  />
                  <CompetitionLink competition={competition} />
                </div>
              )}

              {/* {team && <h2 className="text-2xl font-bold my-4">{compName}</h2>} */}
              {Object.entries(groupedByDate).map(([date, dateMatches]) => (
                <div key={date}>
                  <ul className="space-y-2">
                    {dateMatches.map((m) => (
                      <MatchItem key={m.matchId} match={m} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}
