 public class Match
{
    public int Id { get; set; }
    public int HomeTeamId { get; set; }
    public int AwayTeamId { get; set; }
    public int CompetitionId { get; set; }
    public DateTime Date { get; set; }

    public Team? HomeTeam { get; set; }
    public Team? AwayTeam { get; set; }
    public Competition? Competition { get; set; }
}
