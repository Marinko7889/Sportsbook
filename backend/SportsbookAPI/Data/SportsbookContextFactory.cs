

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

public class SportsbookContextFactory : IDesignTimeDbContextFactory<SportsbookContext>
{
    public SportsbookContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<SportsbookContext>();
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=sportsbookdb;Username=postgres;Password=hajduk");

        return new SportsbookContext(optionsBuilder.Options);
    }
}
