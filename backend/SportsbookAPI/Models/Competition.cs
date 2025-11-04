
public class Competition
{
    public int ID { get; set; }

    public string? Name { get; set; }
    public ICollection<Match> Matches { get; set; } = new List<Match>();
}

