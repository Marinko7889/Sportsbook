using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Logging;

namespace SportsbookAPI.Endpoints
{
    public static class MatchesEndpoints
    {
        public static void RegisterMatchesEndpoint(this WebApplication app)
        {
            var matchesGroup = app.MapGroup("/api/matches").RequireAuthorization();
            matchesGroup.MapGet("/", GetAllMatches);
            matchesGroup.MapPost("/", CreateMatch);
            matchesGroup.MapDelete("/{id}", DeleteMatch);
        }
        private static async Task<IResult> GetAllMatches(SportsbookContext db, ILogger<Program> logger)
        {
            var matches = await db.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Competition)
            .Select(m => new
            {
                MatchId = m.Id,
                HomeTeam = m.HomeTeam.Name,
                AwayTeam = m.AwayTeam.Name,
                Competition = m.Competition.Name,
                Date = m.Date
            })
            .ToListAsync();
            logger.LogInformation("Succesfuly fetched {matches} matches", matches.Count);
            return Results.Ok(matches);
        }

        private static async Task<IResult> CreateMatch(Match match, SportsbookContext db, ILogger<Program> logger)
        {
            if (match == null)
                return Results.BadRequest(new { message = "Match data is required." });

            var homeExists = await db.Teams.AnyAsync(t => t.Id == match.HomeTeamId);
            var awayExists = await db.Teams.AnyAsync(t => t.Id == match.AwayTeamId);
            var compExists = await db.Competitions.AnyAsync(c => c.ID == match.CompetitionId);

            if (!homeExists || !awayExists || !compExists)
            {
                logger.LogWarning("Error adding match");
                return Results.BadRequest(new { message = "Invalid team or competition ID." });

            }

            match.Date = DateTime.SpecifyKind(match.Date, DateTimeKind.Utc);

            db.Matches.Add(match);
            await db.SaveChangesAsync();
            var insertedMatch = await db.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Competition)
                .FirstOrDefaultAsync(m => m.Id == match.Id);

            logger.LogInformation(
                    "Match created successfully: MatchId={MatchId}, {Home} vs {Away} (Competition: {Competition})",
                    insertedMatch?.Id,
                    insertedMatch?.HomeTeam?.Name,
                    insertedMatch?.AwayTeam?.Name,
                    insertedMatch?.Competition?.Name
            );
            return Results.Ok(new
            {
                matchId = insertedMatch?.Id,
                homeTeam = insertedMatch?.HomeTeam?.Name,
                awayTeam = insertedMatch?.AwayTeam?.Name,
                competition = insertedMatch?.Competition?.Name,
                date = insertedMatch?.Date
            });
        }

        private static async Task<IResult>DeleteMatch(int id,SportsbookContext db, ILogger<Program> logger)
        {
            
            var match = await db.Matches.FindAsync(id);
            if (match == null) return Results.NotFound();

            db.Matches.Remove(match);
            await db.SaveChangesAsync();
            logger.LogInformation(
                "Deleted match: ID={MatchId}, {HomeTeam} vs {AwayTeam}",
                match.Id,
                match.HomeTeam?.Name,
                match.AwayTeam?.Name
            );    
            return Results.Ok();
        }
    }
}