public class Igrac
{
    public int Id { get; set; }
    public string Ime { get; set; }
    public int Age { get; set; }
    public string Position { get; set; }
    public int? TeamId { get; set; }
    public Team? Team { get; set; }

}