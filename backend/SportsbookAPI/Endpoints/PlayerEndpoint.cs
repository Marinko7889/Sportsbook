using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Logging;

namespace SportsbookAPI.Endpoints
{
    public static class PlayerEndpoints
    {
        public static void RegisterPlayerEndpoints(this WebApplication app)
        {
            var playerGroup = app.MapGroup("/api/igrac").RequireAuthorization();
            playerGroup.MapGet("/", GetPlayers);
            playerGroup.MapGet("/{id}", GetPlayer);
            playerGroup.MapPost("/", CreatePlayer);
            playerGroup.MapPut("/{id}", UpdatePlayer);
            playerGroup.MapDelete("/{id}", DeletePlayer);
        }
        static IResult? ValidateStringLength(string value, int minLength, string errorMessage)
        {
            if (string.IsNullOrWhiteSpace(value) || value.Length < minLength)
                return Results.BadRequest(errorMessage);
            return null;
        }
        private static async Task<IResult> GetPlayers(SportsbookContext db, ILogger<Program> logger)
        {
            var igraci = await db.Igrac
                .Include(i => i.Team)
                .ToListAsync();
            logger.LogInformation("Fetched {countPlayers} players", igraci.Count);
            return Results.Ok(igraci);
        }
        private static async Task<IResult> GetPlayer(int id, SportsbookContext db, ILogger<Program> logger)
        {
            var igrac = await db.Igrac.FindAsync(id);
            if (igrac == null)
            {
                logger.LogWarning("Player doesnt exist");
                return Results.BadRequest("Player doesnt exist");
            }
            logger.LogInformation("Fetched player {player}", igrac.Ime);
            return Results.Ok(igrac);
        }
        private static async Task<IResult> CreatePlayer(Igrac igrac, SportsbookContext db, ILogger<Program> logger)
        {
            if (igrac == null) return Results.BadRequest();
            if (ValidateStringLength(igrac.Ime, 3, "Name too short") != null)
            {
                logger.LogWarning("Name too short");
                return Results.BadRequest("Name too short");
            }
            else if (ValidateStringLength(igrac.Position, 3, "Position name too short") != null)
            {
                logger.LogWarning("Position name too short");
                return Results.BadRequest("Position name too short");
            }
            else if (igrac.Age < 1)
            {
                logger.LogWarning("Age is below 1");
                return Results.BadRequest("Age is below 1");
            }

            var teamExists = await db.Teams.AnyAsync(t => t.Id == igrac.TeamId);
            if (!teamExists)
                return Results.BadRequest(new { message = "Ne postoji tim s tim ID-em." });
            db.Igrac.Add(igrac);
            await db.SaveChangesAsync();
            logger.LogInformation("Player added {player}", igrac.Ime);
            return Results.Ok(igrac);
        }
        private static async Task<IResult> UpdatePlayer(int id, Igrac igrac, SportsbookContext db, ILogger<Program> logger)
        {
            if (igrac == null || igrac.Id != id) return Results.BadRequest(new { message = "Error" });
            if (ValidateStringLength(igrac.Ime, 3, "Name too short") != null)
            {
                logger.LogWarning("Name too short");
                return Results.BadRequest("Name too short");
            }
            else if (ValidateStringLength(igrac.Position, 3, "Position name too short") != null)
            {
                logger.LogWarning("Position name too short");
                return Results.BadRequest("Position name too short");
            }
            else if (igrac.Age < 1)
            {
                logger.LogWarning("Age is below 1");
                return Results.BadRequest("Age is below 1");
            }
            
            var existing = await db.Igrac.FindAsync(id);
            if (existing == null) return Results.BadRequest(new { message = "Ne postoji taj igrac" });

            existing.Ime = igrac.Ime;
            existing.Age = igrac.Age;
            existing.Position = igrac.Position;
            existing.TeamId = igrac.TeamId;

            await db.SaveChangesAsync();
            logger.LogInformation("Player updated");
            return Results.Ok(existing);
        }
        private static async Task<IResult>DeletePlayer(int id,SportsbookContext db, ILogger<Program> logger)
        {
            var igrac = await db.Igrac.FindAsync(id);
            if (igrac == null)
            {
                logger.LogWarning("Player doesnt exist");
                return Results.BadRequest("Player doesnt exist.Delete failed");
            }
            db.Igrac.Remove(igrac);
            await db.SaveChangesAsync();
            logger.LogInformation("Player {player} deleted ", igrac);
            return Results.Ok();
        }
    }
}