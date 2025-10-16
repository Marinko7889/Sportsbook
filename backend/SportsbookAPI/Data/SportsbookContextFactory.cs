using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Npgsql;

public class SportsbookContextFactory : IDesignTimeDbContextFactory<SportsbookContext>
{
    public SportsbookContext CreateDbContext(string[] args)
    {
        var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrEmpty(databaseUrl))
            throw new InvalidOperationException("DATABASE_URL environment variable is not set.");

        var builder = new NpgsqlConnectionStringBuilder(databaseUrl)
        {
            SslMode = SslMode.Prefer,
            TrustServerCertificate = true
        };

        var optionsBuilder = new DbContextOptionsBuilder<SportsbookContext>();
        optionsBuilder.UseNpgsql(builder.ConnectionString);

        return new SportsbookContext(optionsBuilder.Options);
    }
}

// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Design;

// public class SportsbookContextFactory : IDesignTimeDbContextFactory<SportsbookContext>
// {
//     public SportsbookContext CreateDbContext(string[] args)
//     {
//         var optionsBuilder = new DbContextOptionsBuilder<SportsbookContext>();
//         optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=sportsbookdb;Username=postgres;Password=hajduk");

//         return new SportsbookContext(optionsBuilder.Options);
//     }
// }
