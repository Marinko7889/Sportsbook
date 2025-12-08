using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace SportsbookAPI.Endpoints
{
    public static class CompetitionsEndpoints
    {
        private static HashSet<string> CompetitionsCacheKeys = new HashSet<string>();

        private static void SetCache(IMemoryCache cache, string key, object data)
        {
            cache.Set(key, data, TimeSpan.FromSeconds(60));
            CompetitionsCacheKeys.Add(key);
        }

        private static void InvalidateCompetitionsCache(IMemoryCache cache)
        {
            foreach (var key in CompetitionsCacheKeys)
                cache.Remove(key);
            CompetitionsCacheKeys.Clear();
        }

        public static void RegisterCompetitionsEndpoints(this WebApplication app)
        {
            var competitionsGroup = app.MapGroup("/api/competitions").RequireAuthorization();

            competitionsGroup.MapGet("/", GetAllCompetitions);
            competitionsGroup.MapGet("/{id}", GetCompetitionById);
            competitionsGroup.MapPost("/", CreateCompetition);
            competitionsGroup.MapPut("/{id}", UpdateCompetition);
            competitionsGroup.MapDelete("/{id}", DeleteCompetition);
        }

        

        private static async Task<IResult> GetAllCompetitions(SportsbookContext db, ILogger<Program> logger, IMemoryCache cache)
        {
            string cacheKey = "competitions_all";

            if (cache.TryGetValue(cacheKey, out object cachedData))
            {
                logger.LogInformation("Competitions served from cache (key: {Key})", cacheKey);
                return Results.Ok(cachedData);
            }

            var competitions = await db.Competitions
                .Include(c => c.Matches)
                    .ThenInclude(m => m.HomeTeam)
                .Include(c => c.Matches)
                    .ThenInclude(m => m.AwayTeam)
                .ToListAsync();

            var result = competitions.Select(c => new
            {
                c.ID,
                c.Name,
                c.ImageUrl,
                RowVersion = Convert.ToBase64String(c.RowVersion),
                Matches = c.Matches.Select(m => new { m.Id, HomeTeam = m.HomeTeam.Name, AwayTeam = m.AwayTeam.Name })
            
            });

            SetCache(cache, cacheKey, result);
            logger.LogInformation("Competitions cached (key: {Key})", cacheKey);

            return Results.Ok(result);
        }
        private static async Task<IResult> GetCompetitionById(int id, SportsbookContext db, ILogger<Program> logger)
        {
            var competition = await db.Competitions
                .Include(c => c.Matches)
                    .ThenInclude(m => m.HomeTeam)
                .Include(c => c.Matches)
                    .ThenInclude(m => m.AwayTeam)
                .FirstOrDefaultAsync(c => c.ID == id);

            if (competition == null)
            {
                logger.LogWarning("Competition with ID {CompetitionId} not found", id);
                return Results.NotFound();
            }

            logger.LogInformation("Returned competition {CompetitionName}", competition.Name);
            return Results.Ok(new
            {
                competition.ID,
                competition.Name,
                RowVersion = Convert.ToBase64String(competition.RowVersion ?? new byte[0]),
                Matches = competition.Matches.Select(m => new { m.Id })
            });
        }

        private static async Task<IResult> CreateCompetition(Competition competition,IMemoryCache cache, SportsbookContext db, ILogger<Program> logger)
        {
            if (string.IsNullOrWhiteSpace(competition.Name) || competition.Name.Length < 3)
            {
                logger.LogWarning("Failed to create competition. Name too short");
                return Results.BadRequest(new {message="Name too short"});
            }
            var compName = competition.Name.Trim();
            var normalizedName = compName.ToLower();

            var existingComp = await db.Competitions
                .FirstOrDefaultAsync(c => c.Name.ToLower() == normalizedName);

            if (existingComp != null)
            {
                return Results.Conflict(new { 
                    message = $"Competition '{compName}' already exists."
                });
            }          

            if (competition.RowVersion == null || competition.RowVersion.Length == 0)
            {
                competition.RowVersion = new byte[8];
                Random.Shared.NextBytes(competition.RowVersion);
            }

            db.Competitions.Add(competition);
            await db.SaveChangesAsync();
            InvalidateCompetitionsCache(cache);

            logger.LogInformation("Created competition {CompetitionName}", competition.Name);
            return Results.Ok(new
            {
                competition.ID,
                competition.Name,
                RowVersion = Convert.ToBase64String(competition.RowVersion),
                Matches = competition.Matches.Select(m => new { m.Id })
            });
        }

       
        private static async Task<IResult> UpdateCompetition(
            int id,
            IMemoryCache cache,
            CompetitionUpdateDto dto,
            SportsbookContext db,
            ILogger<Program> logger)
        {
            var existing = await db.Competitions.FirstOrDefaultAsync(c => c.ID == id);
            if (existing == null) return Results.NotFound();

            if (string.IsNullOrWhiteSpace(dto.Name) || dto.Name.Length < 3)
            {
                logger.LogWarning("Failed to update competition. Name too short");
                return Results.BadRequest("Name too short");
            }

            var clientRowVersion = Convert.FromBase64String(dto.RowVersion);
            if (!existing.RowVersion.SequenceEqual(clientRowVersion))
            {
                logger.LogWarning("Concurrency conflict on competition {CompetitionId}", id);
                return Results.Conflict("Competition was updated by another user");
            }

            existing.Name = dto.Name;

            if (dto.ImageUrl != null)
            {
                existing.ImageUrl = dto.ImageUrl;
            }

            existing.RowVersion = new byte[8];
            Random.Shared.NextBytes(existing.RowVersion);

            try
            {
                await db.SaveChangesAsync();
                logger.LogInformation("Updated competition {CompetitionName}", existing.Name);
            }
            catch (DbUpdateConcurrencyException)
            {
                logger.LogError("Concurrency error updating competition {CompetitionId}", id);
                return Results.Conflict("Competition was updated by another user");
            }

            InvalidateCompetitionsCache(cache);

            return Results.Ok(new
            {
                existing.ID,
                existing.Name,
                existing.ImageUrl, 
                RowVersion = Convert.ToBase64String(existing.RowVersion)
            });
        }

       
        private static async Task<IResult> DeleteCompetition(int id,IMemoryCache cache, SportsbookContext db, ILogger<Program> logger)
        {
            var existing = await db.Competitions.FindAsync(id);
            if (existing == null)
            {
                logger.LogWarning("Failed to delete competition. ID {CompetitionId} not found", id);
                return Results.NotFound();
            }

            db.Competitions.Remove(existing);
            await db.SaveChangesAsync();
            InvalidateCompetitionsCache(cache);

            logger.LogInformation("Deleted competition {CompetitionName}", existing.Name);
            return Results.Ok();
        }
    }
}
