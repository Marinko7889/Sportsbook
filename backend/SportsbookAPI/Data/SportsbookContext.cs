using Microsoft.EntityFrameworkCore;

public class SportsbookContext : DbContext
{
    public SportsbookContext(DbContextOptions<SportsbookContext> options)
        : base(options)   
    {
    }

    public DbSet<Team> Teams { get; set; }
    public DbSet<Competition> Competitions { get; set; }
    public DbSet<Match> Matches { get; set; }
    public DbSet<User> Users { get; set; } = null!;

}