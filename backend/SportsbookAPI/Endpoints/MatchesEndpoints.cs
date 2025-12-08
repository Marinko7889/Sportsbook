using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Logging;
using System.Globalization;

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
            matchesGroup.MapGet("/all",GetAllMatchesRaw);
        }
        

        private static async Task<IResult> GetAllMatches(
            SportsbookContext db,
            ILogger<Program> logger,
            int page = 1,
            int? competitionId = null)
        {
            var query = db.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Competition)
                .AsQueryable();

            if (competitionId.HasValue)
                query = query.Where(m => m.Competition.ID == competitionId.Value);

            var matches = await query
                .OrderBy(m => m.Date)
                .ToListAsync();

            if (!matches.Any())
                return Results.Ok(new { matches = new List<object>(), totalDays = 0 });

            var dailyGroups = matches
                .GroupBy(m => m.Date.Date)
                .OrderBy(g => g.Key)
                .ToList();

            int totalDays = dailyGroups.Count;
            int index = page - 1;

            if (index < 0 || index >= totalDays)
                return Results.Ok(new { matches = new List<object>(), totalDays });

            var selectedDay = dailyGroups[index];
            DateTime dayDate = selectedDay.Key;

            var response = new
            {
                page,
                totalDays,
                day = dayDate,
                matches = selectedDay.Select(m => new
                {
                    matchId = m.Id,
                    homeTeam = m.HomeTeam.Name,
                    awayTeam = m.AwayTeam.Name,
                    competition = m.Competition.Name,
                    date = m.Date
                }).ToList()
            };

            logger.LogInformation("Fetched matches for day {day}", dayDate.ToShortDateString());

            return Results.Ok(response);
        }
        private static async Task<IResult> GetAllMatchesRaw(SportsbookContext db)
        {
            var matches = await db.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Include(m => m.Competition)
                .OrderBy(m => m.Date)
                .ToListAsync();

            return Results.Ok(matches.Select(m => new {
                matchId = m.Id,
                homeTeam = m.HomeTeam.Name,
                awayTeam = m.AwayTeam.Name,
                competition = m.Competition.Name,
                date = m.Date
            }));
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
            
            //var match = await db.Matches.FindAsync(id);
            var match = await db.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .FirstOrDefaultAsync(m => m.Id == id);
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