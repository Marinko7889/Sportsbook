
public class Competition
{
    public int ID { get; set; }

    public string Name { get; set; }
    public ICollection<Match> Matches { get; set; } = new List<Match>();
}
public class CompetitionDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<MatchDto> Matches { get; set; } = new();
}

public class MatchDto
{
    public int Id { get; set; }
    public string HomeTeam { get; set; }
    public string AwayTeam { get; set; }
    public DateTime Date { get; set; }
}