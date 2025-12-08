using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Caching.Memory;

namespace SportsbookAPI.Endpoints
{
    public static class TeamsEndpoints
    {
        public static void RegisterTeamsEndpoints(this WebApplication app)
        {
            var teamsGroup = app.MapGroup("/api/teams");
            //.RequireAuthorization();

            teamsGroup.MapGet("/", GetAllTeams);
            teamsGroup.MapGet("/search", SearchTeams);

            teamsGroup.MapGet("/{id}", GetTeamById);
            teamsGroup.MapPost("/", CreateTeam);
            teamsGroup.MapPut("/{id}", UpdateTeam);
            teamsGroup.MapDelete("/{id}", DeleteTeam);

            teamsGroup.MapPost("/{id}/competitions/{competitionId}", AddTeamToCompetition);
            teamsGroup.MapDelete("/{id}/competitions/{competitionId}", RemoveTeamFromCompetition);

        }
        private static HashSet<string> TeamsCacheKeys = new HashSet<string>();

        private static void SetCache(IMemoryCache cache, string key, object data)
        {
            cache.Set(key, data, TimeSpan.FromSeconds(60*5));
            TeamsCacheKeys.Add(key);
        }

        private static void InvalidateTeamsCache(IMemoryCache cache)
        {
            foreach(var key in TeamsCacheKeys)
                cache.Remove(key);
            TeamsCacheKeys.Clear();
        }

            
        
        private static async Task<IResult> GetAllTeams(
            SportsbookContext db,
            ILogger<Program> logger,
            IMemoryCache cache,
            int page = 1,
            int pageSize = 20,
            int? competitionId = null)
        {
            string cacheKey = $"teams_{page}_{pageSize}_{competitionId}";

            if (cache.TryGetValue(cacheKey, out object cachedData))
            {
                logger.LogInformation("Teams served from cache (key: {Key})", cacheKey);
                return Results.Ok(cachedData);
            }

            var query = db.Teams
                .Include(t => t.Competitions)
                .AsQueryable();

            if (competitionId.HasValue)
                query = query.Where(t => t.Competitions.Any(c => c.ID == competitionId.Value));

            var totalTeams = await query.CountAsync();

            var teams = await query
                .OrderBy(t => t.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new TeamDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Competitions = t.Competitions
                        .Select(c => new CompetitionDto
                        {
                            ID = c.ID,
                            Name = c.Name
                        })
                        .ToList()
                })
                .ToListAsync();

            var response = new
            {
                data = teams,
                page,
                pageSize,
                total = totalTeams,
                totalPages = (int)Math.Ceiling(totalTeams / (double)pageSize)
            };

            //cache.Set(cacheKey, response, TimeSpan.FromSeconds(60));
            SetCache(cache, cacheKey, response);

            logger.LogInformation("Teams cached (key: {Key})", cacheKey);
            return Results.Ok(response);
        }
        

        private static async Task<IResult> GetTeamById(int id, SportsbookContext db,ILogger<Program>logger)
        {
            var team = await db.Teams
                .Include(t => t.Competitions)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (team == null)
            {
                logger.LogWarning("Team with ID {TeamId} not found", id);
                return Results.NotFound();

            }

            return Results.Ok(team);
        }
        
        
        private static async Task<IResult> CreateTeam(Team input, IMemoryCache cache, SportsbookContext db, ILogger<Program> logger)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(input.Name) || input.Name.Trim().Length < 3)
                {
                    return Results.BadRequest(new { message = "Team name must be at least 3 characters long." });
                }

                var teamName = input.Name.Trim();
                var normalizedName = teamName.ToLower();

                var existingTeam = await db.Teams
                    .FirstOrDefaultAsync(t => t.Name.ToLower() == normalizedName);

                if (existingTeam != null)
                {
                    return Results.Conflict(new { 
                        message = $"Team '{teamName}' already exists."
                    });
                }

                var team = new Team { Name = teamName };

                if (input.Competitions != null && input.Competitions.Count > 0)
                {
                    foreach (var comp in input.Competitions)
                    {
                        var existingComp = await db.Competitions.FindAsync(comp.ID);
                        if (existingComp != null)
                            team.Competitions.Add(existingComp);
                    }
                }

                db.Teams.Add(team);
                await db.SaveChangesAsync();

                logger.LogInformation("Created new team: {TeamName}", team.Name);
                InvalidateTeamsCache(cache);            
                
                return Results.Created($"/api/teams/{team.Id}", team);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error creating team");
                return Results.Problem("An unexpected error occurred.");
            }
        }
        private static async Task<IResult> UpdateTeam(int id, Team team, SportsbookContext db, ILogger<Program> logger)
        {
            var existing = await db.Teams.FindAsync(id);
            if (existing == null)
            {
                logger.LogWarning("Failed to update. Team with ID {TeamId} not found", id);
                return Results.NotFound();
            }

            if (string.IsNullOrWhiteSpace(team.Name) || team.Name.Length < 3)
            {
                logger.LogWarning("Failed to update team {TeamId}. Name too short", id);
                return Results.BadRequest("Name too short");
            }

            existing.Name = team.Name;
            await db.SaveChangesAsync();

            logger.LogInformation("Updated team {TeamName}", existing.Name);
            return Results.Ok(existing);
        }

        private static async Task<IResult> DeleteTeam(int id,IMemoryCache cache, SportsbookContext db, ILogger<Program> logger)
        {
            var existing = await db.Teams.FindAsync(id);
            if (existing == null)
            {
                logger.LogWarning("Failed to delete. Team with ID {TeamId} not found", id);
                return Results.NotFound();
            }
            bool hasMatches = await db.Matches.AnyAsync(m => m.HomeTeamId == id || m.AwayTeamId == id);

            if (hasMatches)
            {
                logger.LogWarning("Cannot delete team {TeamName}. Team has existing matches.", existing.Name);
                return Results.BadRequest(new { message = "Cannot delete team because it has matches." });
            }
            db.Teams.Remove(existing);
            await db.SaveChangesAsync();
            //cache.Remove("teams_1_20_");
            InvalidateTeamsCache(cache);
            logger.LogInformation("Deleted team {TeamName}", existing.Name);
            return Results.Ok();
        }
    
        private static async Task<IResult> SearchTeams(
            SportsbookContext db,
            string query,
            ILogger<Program> logger) 
        {
            logger.LogInformation("SearchTeams called with query: '{Query}'", query);
            
            if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
            {
                logger.LogInformation("Query too short");
                return Results.Ok(new List<object>());
            }

           
           
            var teams = await db.Teams
                .Where(t => t.Name.ToLower().Contains(query.ToLower()))
                .OrderBy(t => t.Name)
                .Take(20)
                .Select(t => new {
                    t.Id,
                    t.Name
                })
                .ToListAsync();

            logger.LogInformation("Found {Count} teams for query '{Query}'", teams.Count, query);
            
            foreach (var team in teams)
            {
                logger.LogInformation("Team: {Id} - {Name}", team.Id, team.Name);
            }

            return Results.Ok(teams);
        }


        private static async Task<IResult> AddTeamToCompetition(
            int id, 
            int competitionId, 
            SportsbookContext db, 
            ILogger<Program> logger)
        {
            try
            {
                logger.LogInformation("Adding team {TeamId} to competition {CompetitionId}", id, competitionId);

                var team = await db.Teams
                    .Include(t => t.Competitions)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (team == null)
                {
                    logger.LogWarning("Team with ID {TeamId} not found", id);
                    return Results.NotFound(new { message = "Team not found" });
                }

                var competition = await db.Competitions.FindAsync(competitionId);
                if (competition == null)
                {
                    logger.LogWarning("Competition with ID {CompetitionId} not found", competitionId);
                    return Results.NotFound(new { message = "Competition not found" });
                }

                if (team.Competitions.Any(c => c.ID == competitionId))
                {
                    logger.LogWarning("Team {TeamName} is already in competition {CompetitionName}", 
                        team.Name, competition.Name);
                    return Results.Conflict(new { message = $"Team is already in {competition.Name}" });
                }

                team.Competitions.Add(competition);
                await db.SaveChangesAsync();

                logger.LogInformation("Successfully added team {TeamName} to competition {CompetitionName}", 
                    team.Name, competition.Name);

                return Results.Ok(new {
                    message = $"Team {team.Name} added to {competition.Name}",
                    team = new TeamDto
                    {
                        Id = team.Id,
                        Name = team.Name,
                        Competitions = team.Competitions
                            .Select(c => new CompetitionDto
                            {
                                ID = c.ID,
                                Name = c.Name
                            })
                            .ToList()
                    }
                });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error adding team {TeamId} to competition {CompetitionId}", id, competitionId);
                return Results.Problem("An error occurred while adding team to competition");
            }
        }

        private static async Task<IResult> RemoveTeamFromCompetition(
            int id, 
            int competitionId, 
            SportsbookContext db, 
            ILogger<Program> logger)
        {
            try
            {
                logger.LogInformation("Removing team {TeamId} from competition {CompetitionId}", id, competitionId);

                var team = await db.Teams
                    .Include(t => t.Competitions)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (team == null)
                {
                    logger.LogWarning("Team with ID {TeamId} not found", id);
                    return Results.NotFound(new { message = "Team not found" });
                }

                var competition = team.Competitions.FirstOrDefault(c => c.ID == competitionId);
                if (competition == null)
                {
                    logger.LogWarning("Team {TeamName} is not in competition {CompetitionId}", team.Name, competitionId);
                    return Results.NotFound(new { message = "Team is not in this competition" });
                }
                bool hasMatchesInCompetition = await db.Matches
                    .AnyAsync(m => (m.HomeTeamId == id || m.AwayTeamId == id) 
                                && m.CompetitionId == competitionId);

                if (hasMatchesInCompetition)
                {
                    logger.LogWarning(
                        "Cannot remove team {TeamName} from competition {CompetitionName} - team has matches in this competition",
                        team.Name, competition.Name);
                        
                    return Results.BadRequest(new { 
                        message = $"Cannot remove team from {competition.Name} because it has matches in this competition" 
                    });
                }

                team.Competitions.Remove(competition);
                await db.SaveChangesAsync();

                logger.LogInformation("Successfully removed team {TeamName} from competition {CompetitionName}", 
                    team.Name, competition.Name);

                return Results.Ok(new {
                    message = $"Team {team.Name} removed from {competition.Name}",
                    team = new TeamDto
                    {
                        Id = team.Id,
                        Name = team.Name,
                        Competitions = team.Competitions
                            .Select(c => new CompetitionDto
                            {
                                ID = c.ID,
                                Name = c.Name
                            })
                            .ToList()
                    }
                });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error removing team {TeamId} from competition {CompetitionId}", id, competitionId);
                return Results.Problem("An error occurred while removing team from competition");
            }
        }
    }
    
}
