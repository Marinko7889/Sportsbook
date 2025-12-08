
public class Team
{
    public int Id { get; set; }
    public string? Name { get; set; }

    public ICollection<Competition> Competitions { get; set; } = new List<Competition>();

}
public class TeamDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public List<CompetitionDto> Competitions { get; set; } = new();
}

