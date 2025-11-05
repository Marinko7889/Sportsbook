using System.ComponentModel.DataAnnotations;
public class Competition
{
    public int ID { get; set; }

    public string? Name { get; set; }
    public ICollection<Match> Matches { get; set; } = new List<Match>();
    [ConcurrencyCheck]
    public byte[] RowVersion { get; set; }
    
}

public class CompetitionUpdateDto
{
    public string? Name { get; set; }
    public string? RowVersion { get; set; }
}
