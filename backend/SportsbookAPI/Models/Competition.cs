
using System.ComponentModel.DataAnnotations;

public class Competition
{
    public int ID { get; set; }
    public string? Name { get; set; }
    public string? ImageUrl { get; set; }  
    public ICollection<Match> Matches { get; set; } = new List<Match>();
    public ICollection<Team> Teams { get; set; } = new List<Team>();

    [ConcurrencyCheck]
    public byte[] RowVersion { get; set; }
}
public class CompetitionUpdateDto
{
    public string? Name { get; set; }
    public string? ImageUrl { get; set; } 
    public string? RowVersion { get; set; }
}
public class CompetitionDto
{
    public int ID { get; set; }
    public string? Name { get; set; }
}

